import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pagePath = join(root, "app", "page.tsx");
const modulePath = join(root, "app", "user-management.tsx");
const dataPath = join(root, "app", "user-access-data.ts");
const stylesPath = join(root, "app", "user-management.module.css");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const path of [modulePath, dataPath, stylesPath]) {
  assert(existsSync(path), `required user-management artifact missing: ${path}`);
}

const page = readFileSync(pagePath, "utf8");
const moduleSource = readFileSync(modulePath, "utf8");
const data = readFileSync(dataPath, "utf8");
const styles = readFileSync(stylesPath, "utf8");

assert(page.includes('"usuarios"') && page.includes("<UserManagement />"), "dashboard must route to user management");
assert(data.includes('owner: "Propietario"'), "owner role must exist");
assert(data.includes('observer: "Administrador observador"'), "read-only administrator role must exist");
assert(data.includes('member: "Miembro guiado"'), "guided member role must exist");
assert(data.includes('return role === "owner"'), "only the owner may manage users");
assert(data.includes('if (role === "member") return users.filter'), "member visibility must be user-scoped");
assert(moduleSource.includes("el propietario principal no puede degradarse ni pausarse"), "primary owner must be protected");
assert(moduleSource.includes("autenticación Telegram") && moduleSource.includes("initData"), "prototype must disclose production auth boundary");
assert(moduleSource.includes("Modo de solo lectura") || moduleSource.includes("MODO PROTEGIDO"), "non-owner read-only state must be visible");
assert(styles.includes("min-height: 44px") && styles.includes("prefers-reduced-motion"), "UI must include mobile target and reduced motion safeguards");

console.log("user access and RBAC checks passed");
