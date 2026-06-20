import fs from "node:fs/promises";
import path from "node:path";

import { PROFILE_PRESETS, SKILLS, SKILL_INDEX } from "../src/lib/manifest.mjs";

const packageRoot = path.resolve(import.meta.dirname, "..");
const seenCanonical = new Set();

for (const skill of SKILLS) {
  if (seenCanonical.has(skill.canonical)) {
    throw new Error(`Duplicate canonical skill: ${skill.canonical}`);
  }

  seenCanonical.add(skill.canonical);

  const sourceDir = path.join(packageRoot, "skills-src", skill.canonical);
  await fs.access(sourceDir);
}

for (const [profile, preset] of Object.entries(PROFILE_PRESETS)) {
  for (const skillName of preset.skills) {
    if (!SKILL_INDEX.has(skillName)) {
      throw new Error(`Profile ${profile} references unknown skill ${skillName}`);
    }
  }
}

console.log("manifest lint passed");
