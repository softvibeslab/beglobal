#!/usr/bin/env python3
"""Read-only bounded knowledge tools; no network, arbitrary paths or execution."""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import unicodedata
from collections import deque
from pathlib import Path

REPO=Path(__file__).resolve().parents[1]
ROOT=REPO/'beglobal/dataset/premium/knowledge-bases/2026-09-08/academia-pro-agent'
NOTICE='Catálogo = referencia inferida, no enseñanza verificada. ASR = transcripción automática no aprobada. Casos/capacidades = propuestas pendientes de Corporate.'
STOP={'para','como','cual','quiero','necesito','ayuda','sobre','tengo','que','del','las','los','una','con','por','mejorar','curso','leccion'}

def fold(text):
    return ''.join(c for c in unicodedata.normalize('NFKD',str(text).lower()) if not unicodedata.combining(c))

def terms(text):
    return [x for x in re.findall(r'[a-z0-9]+',fold(text)) if len(x)>2 and x not in STOP]

def load(path):
    return json.loads(path.read_text(encoding='utf-8'))

class Knowledge:
    def __init__(self,root=ROOT):
        self.root=Path(root)
        payload=load(self.root/'lesson-reference-index.json')
        self.rows={r['node_id']:r for r in payload['lessons']}
        self.scope=load(self.root/'scope.json')
        self.graph=load(self.root/'graphify-out/graph.json')
        self.nodes={n['id']:n for n in self.graph['nodes']}
        self.links=self.graph.get('links',self.graph.get('edges',[]))

    @staticmethod
    def public_row(row):
        keys=['node_id','course','course_id','id','title','url','level','section','domain','domain_label',
              'reference_contribution','reference_confidence','reference_confidence_score','evidence_level',
              'content_summary','content_topics','candidate_case_ids','content_based_candidate_case_ids','resource_inventory','human_approved','review_status']
        return {k:row.get(k) for k in keys}

    def status(self):
        return dict(notice=NOTICE,as_of=self.scope['created_at'],courses=self.scope['courses'],
            lessons=len(self.rows),with_local_transcript=sum(r['has_transcript'] for r in self.rows.values()),
            ambiguous_title_references=sum(r['reference_confidence']=='AMBIGUOUS' for r in self.rows.values()),
            published=False,live_platform_access=False,new_downloads_this_build=0)

    def search(self,query,domain='',evidence='all',limit=5):
        if not isinstance(query,str) or len(query)>500:raise ValueError('Query must be at most 500 characters')
        if evidence not in {'all','LOCAL_ASR','CATALOG_REFERENCE','AMBIGUOUS'}:raise ValueError('Unknown evidence filter')
        if not 1<=limit<=10:raise ValueError('limit must be 1..10')
        if domain and domain not in {r['domain'] for r in self.rows.values()}:raise ValueError('Unknown domain')
        query_terms=terms(query)
        if not query_terms:return dict(notice=NOTICE,results=[],clarification='Indica tema, producto, canal o bloqueo concreto.')
        ranked=[]
        for row in self.rows.values():
            if domain and row['domain']!=domain:continue
            if evidence!='all' and evidence not in {row['evidence_level'],row['reference_confidence']}:continue
            title=fold(row['title']);context=fold(' '.join([row['course'],row['domain_label'],row['reference_contribution'],
                row.get('content_summary') or '',*row.get('content_topics',[])]))
            hits=sum(3*(t in title)+(t in context) for t in query_terms)
            if not hits:continue
            score=hits+(0.5 if row['has_transcript'] else 0)-(1 if row['reference_confidence']=='AMBIGUOUS' else 0)
            ranked.append((score,row))
        ranked.sort(key=lambda x:(-x[0],x[1]['node_id']))
        return dict(notice=NOTICE,total_matches=len(ranked),results=[self.public_row(r) for _,r in ranked[:limit]],
                    retrieval_method='Title/context term ranking; relevance is not proof of lesson content.')

    def lesson(self,lesson_key):
        if lesson_key not in self.rows:raise ValueError('Unknown lesson ID; use an exact node_id from search_academy')
        row=self.rows[lesson_key]
        return dict(notice=NOTICE,lesson=self.public_row(row),
            catalog_citation=dict(source=self.scope['workbook'],location='Lecciones; URL lección='+row['url']),
            summary_citation=dict(source=row['content_source'],basis='LOCAL_ASR_AND_PRIOR_ANALYSIS') if row['content_summary'] else None)

    def evidence(self,lesson_key,query=''):
        if len(query)>500:raise ValueError('Query must be at most 500 characters')
        result=self.lesson(lesson_key);row=self.rows[lesson_key]
        if not row['has_transcript']:
            return dict(notice=NOTICE,status='NO_LOCAL_TRANSCRIPT',lesson=result['lesson'],excerpts=[],
                next_step='Consultar la lección original o completar ingesta; no deducir instrucciones de su título.')
        # Fixed per-lesson source selected by the build, never a path supplied by a caller.
        source=(REPO/row['content_source']).resolve()
        allowed=REPO/'beglobal/dataset/premium/knowledge-bases/2026-09-05/contenido-pro/corpus'
        if not source.is_relative_to(allowed) or source.suffix!='.md':raise ValueError('Source outside approved corpus')
        preserved=self.scope['preserved_sha256'].get(str(source.relative_to(REPO)))
        if preserved is None or hashlib.sha256(source.read_bytes()).hexdigest()!=preserved:
            raise ValueError('Source changed since build; rebuild before using it as evidence')
        content=source.read_text(encoding='utf-8')
        marker='## Transcripción completa (ASR, fuente primaria textual)'
        if marker not in content:raise ValueError('ASR section missing; do not treat prior analysis as transcript')
        body=content.split(marker,1)[1]
        chunks=[body[i:i+1500] for i in range(0,len(body),1500)]
        query_terms=terms(query)
        ranked=sorted(enumerate(chunks),key=lambda p:-sum(fold(p[1]).count(t) for t in query_terms))
        chosen=ranked[:3] if query_terms else list(enumerate(chunks[:2]))
        return dict(notice=NOTICE,status='LOCAL_ASR_EXCERPTS',lesson_id=lesson_key,source_url=row['url'],
            source_file=row['content_source'],source_sha256=preserved,
            selection='keyword_ranked' if query_terms else 'beginning_of_transcript',
            excerpts=[dict(text=text,location=f'ASR character offset {i*1500}; not a timestamp') for i,text in chosen],
            caveat='Fragmentos automáticos, no revisión humana ni verificación de políticas vigentes; pueden comenzar a mitad de frase.')

    def trace(self,source_id,target_id,max_hops=4):
        if source_id not in self.nodes or target_id not in self.nodes:raise ValueError('Unknown graph node')
        if not 1<=max_hops<=4:raise ValueError('max_hops must be 1..4')
        neighbors={};records={}
        for edge in self.links:
            a,b=edge['source'],edge['target'];neighbors.setdefault(a,[]).append(b);neighbors.setdefault(b,[]).append(a)
            records[frozenset([a,b])]=edge
        queue=deque([[source_id]]);seen={source_id}
        while queue:
            path=queue.popleft()
            if path[-1]==target_id:
                steps=[]
                for a,b in zip(path,path[1:]):
                    edge=records[frozenset([a,b])];evidence=edge.get('evidence_records',[edge])
                    steps.append(dict(from_id=a,to_id=b,evidence=[{k:e.get(k) for k in
                        ['source','target','relation','confidence','confidence_score','source_file','source_location','rationale','evidence_basis']} for e in evidence[:4]]))
                return dict(notice=NOTICE,path=[dict(id=n,label=self.nodes[n]['label']) for n in path],steps=steps,
                    caveat='La navegación es no dirigida; cada evidencia conserva source/target originales. Una ruta no implica causalidad ni aprobación.')
            if len(path)-1>=max_hops:continue
            for other in neighbors.get(path[-1],[]):
                if other not in seen:seen.add(other);queue.append(path+[other])
        return dict(notice=NOTICE,path=[],steps=[],reason='No path within the bounded search; do not invent a connection.')

def server(root=ROOT):
    from mcp.server.fastmcp import FastMCP
    from mcp.types import ToolAnnotations
    knowledge=Knowledge(root)
    mcp=FastMCP('beglobal_academy',instructions=NOTICE,log_level='ERROR')
    annotations=ToolAnnotations(readOnlyHint=True,destructiveHint=False,idempotentHint=True,openWorldHint=False)
    @mcp.tool(annotations=annotations)
    def knowledge_status()->dict:
        """Return actual coverage and evidence limits of this private academy snapshot."""
        return knowledge.status()
    @mcp.tool(annotations=annotations)
    def search_academy(query:str,domain:str='',evidence:str='all',limit:int=5)->dict:
        """Find lesson references; title-based potential contributions are not verified teachings."""
        return knowledge.search(query,domain,evidence,limit)
    @mcp.tool(annotations=annotations)
    def get_lesson_reference(lesson_key:str)->dict:
        """Read a specific lesson reference and keep inferred contribution separate from ASR summary."""
        return knowledge.lesson(lesson_key)
    @mcp.tool(annotations=annotations)
    def get_lesson_evidence(lesson_key:str,query:str='')->dict:
        """Read bounded, hash-verified ASR excerpts, or explicitly report missing transcript."""
        return knowledge.evidence(lesson_key,query)
    @mcp.tool(annotations=annotations)
    def trace_knowledge_connection(source_id:str,target_id:str,max_hops:int=4)->dict:
        """Find a bounded graph path retaining original direction and confidence of each relation."""
        return knowledge.trace(source_id,target_id,max_hops)
    mcp.run(transport='stdio')

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('command',choices=['serve','status','search'])
    parser.add_argument('--query',default='');args=parser.parse_args()
    if args.command=='serve':server()
    else:
        k=Knowledge();print(json.dumps(k.status() if args.command=='status' else k.search(args.query),ensure_ascii=False,indent=2))
