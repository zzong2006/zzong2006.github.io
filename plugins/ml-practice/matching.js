export function exercisesForNote(problems, slug) {
  const note = "/" + String(slug ?? "").replace(/^\/+/, "")
  return problems.filter(p => p.source === note || (p.relatedNotes ?? []).includes(note))
}
