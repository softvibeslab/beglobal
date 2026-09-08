import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const towerPath = join(root, "app", "control-tower.tsx");
const modulePath = join(root, "app", "profile-contribution-intelligence.tsx");
const dataPath = join(root, "app", "profile-contribution-data.ts");
const stylesPath = join(root, "app", "globals.css");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(existsSync(modulePath), "profile contribution intelligence module must exist");
assert(existsSync(dataPath), "profile contribution analysis data must exist");

const tower = readFileSync(towerPath, "utf8");
const moduleSource = readFileSync(modulePath, "utf8");
const data = readFileSync(dataPath, "utf8");
const styles = readFileSync(stylesPath, "utf8");

assert(
  tower.includes("ProfileContributionIntelligence"),
  "control tower must render the profile contribution intelligence module",
);
assert(
  moduleSource.includes("Corporate + Team → Member"),
  "module must explain the transfer from corporate and team to member",
);
assert(
  moduleSource.includes("Cobertura del corpus"),
  "module must expose corpus coverage",
);
assert(
  moduleSource.includes("No transferir al miembro"),
  "module must visibly protect member data boundaries",
);
assert(
  data.includes('profile: "beglobal-corporate"') && data.includes('profile: "beglobal-team"'),
  "analysis must cover both source profiles",
);
assert(
  data.includes("includedContributions: 93") && data.includes("includedContributions: 96"),
  "analysis must preserve verified contribution counts",
);
assert(
  data.includes('status: "confirmed"') &&
    data.includes('status: "proposed"') &&
    data.includes('status: "inferred"'),
  "analysis must distinguish evidence status",
);
assert(
  data.includes("memberImpactAreas") && data.includes("memberDataBoundaries"),
  "analysis must map impact and member data boundaries",
);
assert(
  data.includes("reusableAssets") && moduleSource.includes("Activos reutilizables"),
  "analysis must expose governed reusable assets produced from user contributions",
);
assert(
  data.includes("audio-text-alternative") && data.includes("governed-trends"),
  "member impact must include accessible delivery and governed trend discovery",
);
assert(
  data.includes("SOURCE_MANIFEST.md") && data.includes("state.db"),
  "analysis must expose provenance without publishing raw messages",
);
assert(
  !data.includes("content:") && !data.includes("rawMessages"),
  "public analysis must not embed raw user messages",
);
assert(
  styles.includes("profile-intelligence"),
  "styles must include profile intelligence classes",
);

console.log("profile contribution intelligence checks passed");
