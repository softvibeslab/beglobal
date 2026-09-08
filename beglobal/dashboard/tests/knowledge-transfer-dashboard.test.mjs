import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pagePath = join(root, "app", "page.tsx");
const modulePath = join(root, "app", "team-knowledge-transfer.tsx");
const dataPath = join(root, "app", "knowledge-transfer-data.ts");
const stylesPath = join(root, "app", "globals.css");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(existsSync(modulePath), "team knowledge transfer module must exist");
assert(existsSync(dataPath), "knowledge transfer data module must exist");

const page = readFileSync(pagePath, "utf8");
const moduleSource = readFileSync(modulePath, "utf8");
const data = readFileSync(dataPath, "utf8");
const styles = readFileSync(stylesPath, "utf8");

assert(page.includes('"transferencia"'), "dashboard view union/nav must include transferencia");
assert(page.includes("TeamKnowledgeTransfer"), "dashboard must render TeamKnowledgeTransfer");
assert(page.includes('label: "Transferencia"'), "sidebar must expose Transferencia nav item");

assert(data.includes("shopify-store-authorization"), "data must include Shopify authorization knowledge item");
assert(data.includes("mediaHubLinks"), "knowledge entries must declare mediaHubLinks");
assert(data.includes("chatMessages"), "knowledge entries must keep source chat messages");
assert(data.includes("confirmed") && data.includes("proposed") && data.includes("blocked"), "status taxonomy must be represented");

assert(moduleSource.includes("Media Hub"), "module must visibly link knowledge entries to Media Hub");
assert(moduleSource.includes("onOpenMediaHub"), "module must provide a direct action to open Media Hub");
assert(page.includes('onOpenMediaHub={() => setView("mediahub")}'), "dashboard must wire Transferencia to Media Hub navigation");
assert(moduleSource.includes("statusLabels"), "module must label entry validation status");
assert(moduleSource.includes("mediaHubLinks"), "module must render media hub links per entry");

assert(styles.includes("knowledge-transfer"), "styles must include knowledge transfer classes");

console.log("knowledge transfer dashboard checks passed");
