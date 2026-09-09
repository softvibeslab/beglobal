"""Áureo: heurísticas de proporción áurea y Fibonacci para gestión de conocimiento,
agentes guiados y progresión de miembros.

Solo biblioteca estándar. Todas las reglas son heurísticas (INFERRED), no hechos.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Callable, Iterable, Sequence

PHI = (1 + math.sqrt(5)) / 2          # 1.618...
INV_PHI = 1 / PHI                     # 0.618...
MINOR = 1 - INV_PHI                   # 0.382...

FIB_SIZES = (1, 2, 3, 5, 8, 13, 21)


# ---------------------------------------------------------------- proporción

def golden_split(total: float) -> tuple[float, float]:
    """Divide `total` en (mayor, menor) según el corte áureo 62/38."""
    major = total * INV_PHI
    return major, total - major


def golden_split_int(total: int) -> tuple[int, int]:
    """Corte áureo con enteros; el mayor se redondea al entero más cercano."""
    major = round(total * INV_PHI)
    return major, total - major


def session_split(minutes: int) -> dict[str, int]:
    """Reparte una sesión en minutos de misión (hacer) y lección (aprender)."""
    do, learn = golden_split_int(minutes)
    return {"mision_min": do, "leccion_min": learn}


def context_budget(tokens: int, executing: bool = False) -> dict[str, int]:
    """Presupuesto de contexto del agente.

    Por defecto 62 % estado del miembro / 38 % conocimiento del método.
    Durante ejecución de misión se invierte temporalmente.
    """
    major, minor = golden_split_int(tokens)
    if executing:
        return {"conocimiento": major, "estado_miembro": minor}
    return {"estado_miembro": major, "conocimiento": minor}


# ---------------------------------------------------------------- fibonacci

def fibonacci(n: int) -> list[int]:
    """Primeros n términos de Fibonacci empezando en 1, 1."""
    if n <= 0:
        return []
    seq = [1, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq[:n]


def to_fib_size(estimate: float, sizes: Sequence[int] = FIB_SIZES) -> int:
    """Redondea una estimación de esfuerzo a la talla Fibonacci más cercana.

    En empate se elige la mayor, porque la incertidumbre crece con el tamaño.
    """
    if estimate <= 0:
        return sizes[0]
    best = sizes[0]
    best_d = abs(estimate - best)
    for s in sizes[1:]:
        d = abs(estimate - s)
        if d <= best_d:
            best, best_d = s, d
    return best


def needs_split(size: int, threshold: int = 8) -> bool:
    """Una misión de talla >= threshold debe descomponerse antes de asignarse."""
    return size >= threshold


def reminder_schedule(steps: int = 6, start_day: int = 0) -> list[int]:
    """Días (relativos a la última acción) en que se envía recordatorio: 1,2,3,5,8,13."""
    days = [1, 2, 3, 5, 8, 13, 21, 34]
    return [start_day + d for d in days[:steps]]


def mission_spiral(n: int) -> list[int]:
    """Tallas de las primeras n misiones: 1, 1, 2, 3, 5, 8..."""
    return fibonacci(n)


def level_curve(levels: int, base_xp: int = 500) -> list[dict[str, int]]:
    """Curva de niveles con umbral Fibonacci: XP del nivel = base_xp * fib(n-1)."""
    fibs = fibonacci(levels)
    rows, total = [], 0
    for lvl in range(2, levels + 2):
        xp = base_xp * fibs[lvl - 2]
        total += xp
        rows.append({"nivel": lvl, "xp_nivel": xp, "xp_acumulado": total})
    return rows


# ---------------------------------------------------------------- ramificación

@dataclass
class BranchReport:
    node: str
    children: int
    verdict: str            # "ok" | "split" | "merge"
    suggested_parts: int = 0


def branching_audit(
    tree: dict[str, int], low: int = 3, high: int = 13
) -> list[BranchReport]:
    """Audita la ramificación: cada nodo debería tener entre `low` y `high` hijos.

    `tree` mapea nombre de nodo -> número de hijos.
    Si supera `high`, sugiere partir en ceil(hijos / 8) partes (talla objetivo 8).
    """
    out = []
    for name, n in tree.items():
        if n > high:
            out.append(BranchReport(name, n, "split", math.ceil(n / 8)))
        elif n < low:
            out.append(BranchReport(name, n, "merge"))
        else:
            out.append(BranchReport(name, n, "ok"))
    return sorted(out, key=lambda r: -r.children)


# ---------------------------------------------------------------- ingesta

def ingestion_budget(capacity: int, focus_courses: int) -> dict[str, int]:
    """Presupuesto de lecciones a procesar por ciclo: 62 % profundidad, 38 % amplitud."""
    depth, breadth = golden_split_int(capacity)
    per_course = max(1, depth // max(1, focus_courses))
    return {
        "capacidad": capacity,
        "profundidad": depth,
        "amplitud": breadth,
        "por_curso_foco": per_course,
    }


# ---------------------------------------------------------------- optimización

@dataclass
class GoldenSearchState:
    lo: float
    hi: float
    history: list[tuple[float, float]] = field(default_factory=list)

    @property
    def x1(self) -> float:
        return self.hi - INV_PHI * (self.hi - self.lo)

    @property
    def x2(self) -> float:
        return self.lo + INV_PHI * (self.hi - self.lo)

    def next_probes(self) -> tuple[float, float]:
        """Los dos valores a probar en el ciclo actual (posiciones 0.382 y 0.618)."""
        return self.x1, self.x2

    def update(self, f1: float, f2: float) -> "GoldenSearchState":
        """Registra resultados de x1 y x2 y estrecha el intervalo (maximización)."""
        self.history.append((self.x1, f1))
        self.history.append((self.x2, f2))
        if f1 > f2:
            self.hi = self.x2
        else:
            self.lo = self.x1
        return self

    @property
    def estimate(self) -> float:
        return (self.lo + self.hi) / 2

    @property
    def width(self) -> float:
        return self.hi - self.lo


def golden_section_search(
    f: Callable[[float], float], lo: float, hi: float, iterations: int = 6
) -> tuple[float, float]:
    """Maximiza f unimodal en [lo, hi]. Devuelve (x_estimado, ancho_final).

    Cada iteración reduce el intervalo al 61.8 %; tras 6, queda ~5.6 % del original.
    """
    st = GoldenSearchState(lo, hi)
    for _ in range(iterations):
        x1, x2 = st.next_probes()
        st.update(f(x1), f(x2))
    return st.estimate, st.width


# ---------------------------------------------------------------- respuesta

RESPONSE_RULE = {
    "siguiente_paso": 1,
    "recursos_max": 2,
    "acciones_max": 3,
    "preguntas_diagnostico": 5,
}


def check_response(actions: int, resources: int, next_steps: int) -> list[str]:
    """Verifica la regla 1-2-3-5 sobre una respuesta del agente. Devuelve violaciones."""
    issues = []
    if next_steps != RESPONSE_RULE["siguiente_paso"]:
        issues.append(f"siguiente_paso={next_steps}, esperado 1")
    if resources > RESPONSE_RULE["recursos_max"]:
        issues.append(f"recursos={resources}, máximo 2")
    if actions > RESPONSE_RULE["acciones_max"]:
        issues.append(f"acciones={actions}, máximo 3")
    return issues


def word_ratio(actionable_words: int, context_words: int) -> dict[str, float]:
    """Proporción accionable/contexto de una ficha; objetivo ~0.62 accionable."""
    total = actionable_words + context_words
    if total == 0:
        return {"accionable": 0.0, "contexto": 0.0, "desvio": INV_PHI}
    a = actionable_words / total
    return {"accionable": round(a, 3), "contexto": round(1 - a, 3), "desvio": round(abs(a - INV_PHI), 3)}
