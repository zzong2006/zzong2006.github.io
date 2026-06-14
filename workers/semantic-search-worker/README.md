# Semantic Search Worker

This Worker keeps `GEMINI_API_KEY` off GitHub Pages. The static site sends only the query text to the Worker, then the browser compares the returned query embedding against `static/semanticIndex.json`.

## Deploy

```bash
cd workers/semantic-search-worker
npx wrangler secret put GEMINI_API_KEY
npx wrangler deploy
```

After deploy, set the `endpoint` option for `./plugins/semantic-search` in `quartz.config.yaml`:

```yaml
options:
  endpoint: https://<your-worker-domain>/
```

If you use the default Worker route, the endpoint is usually the Worker URL itself because this Worker accepts `POST /`.

## Runtime variables

- `GEMINI_API_KEY`: required secret.
- `GEMINI_EMBEDDING_MODEL`: defaults to `gemini-embedding-2`.
- `GEMINI_EMBEDDING_DIM`: defaults to `768`.
- `ALLOWED_ORIGINS`: comma-separated origins allowed to call the Worker.
