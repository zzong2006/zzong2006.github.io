export function exercisesForNote(problems, slug) {
  const normalize = value => "/" + String(value ?? "").replace(/^\/+/, "").toLowerCase()
  const note = normalize(slug)
  return problems.filter(p => [p.source, ...(p.relatedNotes ?? [])].some(source => normalize(source) === note))
}
