/**
 * Builds lookup tables from portfolioData.json for stable share-link resolution.
 * Slugs are permanent identifiers; legacy hashes (project/2, timeline/exp-0) map via aliases.
 */

/**
 * @param {object} data portfolioData.json
 * @returns {{ projectBySlug: Map, timelineBySlug: Map, aliasToSlug: Map }}
 */
export function buildShareRegistry(data) {
  const projectBySlug = new Map();
  const timelineBySlug = new Map();
  const aliasToSlug = new Map();
  const seenSlugs = new Set();

  const registerSlug = (slug, kind) => {
    if (!slug) return;
    const key = `${kind}:${slug}`;
    if (seenSlugs.has(key)) {
      console.warn(`[shareLink] Duplicate slug "${slug}" in ${kind}`);
    }
    seenSlugs.add(key);
  };

  (data.projects || []).forEach((project) => {
    const slug = project.slug?.trim();
    if (!slug) return;
    registerSlug(slug, 'project');
    projectBySlug.set(slug, { slug, numericId: project.id });
    aliasToSlug.set(`project/${slug}`, slug);
    if (project.id != null) {
      aliasToSlug.set(`project/${project.id}`, slug);
    }
  });

  (data.experience || []).forEach((item, idx) => {
    const slug = item.slug?.trim();
    if (!slug) return;
    registerSlug(slug, 'timeline');
    timelineBySlug.set(slug, { slug, category: 'experience' });
    aliasToSlug.set(`timeline/${slug}`, slug);
    aliasToSlug.set(`timeline/exp-${idx}`, slug);
  });

  (data.education || []).forEach((item, idx) => {
    const slug = item.slug?.trim();
    if (!slug) return;
    registerSlug(slug, 'timeline');
    timelineBySlug.set(slug, { slug, category: 'education' });
    aliasToSlug.set(`timeline/${slug}`, slug);
    aliasToSlug.set(`timeline/edu-${idx}`, slug);
  });

  const custom = data.shareAliases || {};
  for (const [aliasKey, slug] of Object.entries(custom)) {
    if (typeof slug === 'string' && slug.trim()) {
      aliasToSlug.set(aliasKey, slug.trim());
    }
  }

  return { projectBySlug, timelineBySlug, aliasToSlug };
}

/**
 * @param {'project' | 'timeline'} kind
 * @param {string} hashId raw id from URL hash
 * @param {ReturnType<typeof buildShareRegistry>} registry
 * @returns {{ slug: string, category: 'experience' | 'education' | null } | null}
 */
export function resolveShareTarget(kind, hashId, registry) {
  if (!registry || !hashId) return null;
  const id = String(hashId).trim();
  if (!id) return null;

  if (kind === 'project') {
    if (registry.projectBySlug.has(id)) {
      return { slug: id, category: null };
    }
    const slug = registry.aliasToSlug.get(`project/${id}`);
    if (slug && registry.projectBySlug.has(slug)) {
      return { slug, category: null };
    }
    return null;
  }

  if (kind === 'timeline') {
    if (registry.timelineBySlug.has(id)) {
      return { slug: id, category: registry.timelineBySlug.get(id).category };
    }
    const slug = registry.aliasToSlug.get(`timeline/${id}`);
    if (slug && registry.timelineBySlug.has(slug)) {
      return { slug, category: registry.timelineBySlug.get(slug).category };
    }
    return null;
  }

  return null;
}

let activeRegistry = null;

export function setShareRegistry(data) {
  activeRegistry = data ? buildShareRegistry(data) : null;
}

export function getShareRegistry() {
  return activeRegistry;
}
