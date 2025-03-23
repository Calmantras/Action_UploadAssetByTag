# Upload Release Asset By Tag

GitHub Action to upload assets to a release identified by its tag name.

## Development

```bash
# Install dependencies
npm install

# Bundle for production (creates dist/index.js)
npm run bundle
```

## Inputs

- `asset_tag`: Tag name of the target release (optional)
- `asset_path`: Path to the file to upload (required)
- `asset_name`: Name for the uploaded asset (required)
- `asset_content_type`: MIME type of the asset (required)

## Output

- `browser_download_url`: URL for downloading the uploaded asset

## Usage

```yaml
steps:
  - uses: Calmantras/Action_UploadByTag@v1
    with:
      asset_tag: v1.0
      asset_path: ./build/app.zip
      asset_name: app.zip
      asset_content_type: application/zip
```
