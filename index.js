// require @actions/core
// require @actions/github
const core = require('@actions/core');
const { context} = require('@actions/github');
const github = require('@actions/github');
const fs = require("fs");

(async () => {
    try {
        // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
        const gh = new github.getOctokit(process.env.GITHUB_TOKEN)
        core.info(`Authenticating...`)

        // Get owner and repo from context of payload that triggered the action
        const { owner: currentOwner, repo: currentRepo } = context.repo

        // All Inputs
        // Owner of Repo and Repo itself to get Tag from, as input or from context
        const assetOwner = core.getInput('owner', { required: false }) || currentOwner
        const assetRepo = core.getInput('repo', { required: false }) || currentRepo
        const assetTag = core.getInput('asset_tag', { required: false } || 'Latest')
        // Where the assets to upload are
        const assetPath = core.getInput('asset_path', { required: true })
        const assetName = core.getInput('asset_name', { required: true })
        // How to upload asset
        const assetContentType = core.getInput('asset_content_type', {required: true})

        // Getting the uploadUrl of the Release with the Latest tag
        const releaseIdResponse = await gh.repos.getReleaseByTag({
            owner: assetOwner,
            repo: assetRepo,
            tag: assetTag
        })

        // The releaseId with specified tag
        const releaseId = releaseIdResponse.data.id
        core.info(`Found Repo with tag: ${assetTag}. Id is: ${releaseId}`)
        core.info(`Uploading... `)
        // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs


        // Determine content-length for header to upload asset
        const contentLength = (filePath) => fs.statSync(filePath).size

        // Setup headers for API call, see Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset for more information
        const headers = {
            'content-type': assetContentType,
            'content-length': contentLength(assetPath)
        }

        // Upload a release asset
        // API Documentation: https://developer.github.com/v3/repos/releases/#upload-a-release-asset
        // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset
        const uploadAssetResponse = await gh.repos.uploadReleaseAsset({
            release_id: releaseId,
            headers,
            name: assetName,
            file: fs.readFileSync(assetPath)
        })

        // Get the browser_download_url for the uploaded release asset from the response
        const {
            data: { browser_download_url: browserDownloadUrl }
        } = uploadAssetResponse

        core.info('Upload completed! Link is under outputs in browser_download_url.');

        // Set the output variable for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
        core.setOutput('browser_download_url', browserDownloadUrl)
    } catch (error) {
        core.setFailed(error.message)
    }
})();