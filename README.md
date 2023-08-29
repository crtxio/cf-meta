# Cloudflare Meta

This repository is meant for use in conjunction with [Cortex-Publisher](https://github.com/crtxio/cortex-publisher) and [CF-Gateway](https://github.com/crtxio/cf-gateway). The cf-meta Cloudflare worker serves as the metadata server for your Cortex-Publisher. This provides for faster low cost consensus lookups.

## Prerequisites

1. First you must have followed and successfully deployed the [Cortex-Publisher](https://github.com/crtxio/cortex-publisher).

2. Create a Cloudflare API Token. For more information on how create and use API tokens for use in CI/CD please visit [Create a Cloudflare API token](https://developers.cloudflare.com/workers/wrangler/ci-cd/#create-a-cloudflare-api-token). If you have already created a Cloudflare API Token from deploying the [Cortex-Publisher](https://github.com/crtxio/cortex-publisher) then you may skip this step.

3. Install the and setup the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for use.

4. (__*Optional*__): [Install the Github CLI](https://cli.github.com/manual/installation).

## Deployment

1. [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/crtxio/cf-meta) <---- __*Click Here*__

    - This will bring you to a web page requiring your Cloudflare account ID and API Token that you created from the previous step.
    - You will also be linked to the newly forked repository to enable Github Workflows. For more information on workflows please visit Github's [About workflows](https://docs.github.com/en/actions/using-workflows/about-workflows).

    __*Note*__: This will run an initial workflow that will fail by design as you do not currently have the required Github actions secrets populated for a clean deployment. Updates to come on this part of the deployment process in the future.

2. Create the following KV namespaces in your Cloudflare account. If you have deployed the [Cortex-Publisher](https://github.com/crtxio/cortex-publisher) you will have already created these KV stores and may skip this step.

    - RESOLVER
    - RESOLVER-PREVIEW
    - ZONES
    - ZONES-PREVIEW

   To create the KV namespaces, you must have Wrangler CLI installed then run the following commands in your console. Make sure to record the output ID's for each KV namespace as they are needed for use in a later step.

    ```console
        wrangler kv:namespace create "RESOLVER"
        wrangler kv:namespace create "RESOLVER" --preview
        wrangler kv:namespace create "ZONES"
        wrangler kv:namespace create "ZONES" --preview

    ```

      __*Note*__: If you didn't capture the KV namespace ID's you can run the following command from your console to acquire them.

    ```console
        wrangler kv:namespace list
    ```

3. Navigate to your newly forked repository to configure github actions with the following secrets. Visit the official Github docs on how to use [Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

    - __*CLOUDFLARE_API_TOKEN*__: The API token associated to your Cloudflare account.
    - __*CLOUDFLARE_ACCOUNT_ID*__: The ID of your Cloudflare account.
    - __*CLOUDFLARE_ZONE_ID*__: The Zone ID of the domain within your Cloudflare account.
    - __*RESOLVER_KV_ID*__: The ID of the RESOLVER KV you created in the previous step
    - __*RESOLVER_KV_PREVIEW_ID*__: The ID of the RESOLVER_PREVIEW KV you created in the previous step.
    - __*ZONES_KV_ID*__: The ID of the ZONES KV you created in the previous step
    - __*ZONES_KV_PREVIEW_ID*__: The ID of the ZONES_PREVIEW KV you created in the previous step.

    __*Note*__: You may also use the Github CLI to accomplish the same.

    ```console
        gh secret set REPO_OWNER/REPO_NAME <__*CLOUDFLARE_API_TOKEN*__>
        gh secret set REPO_OWNER/REPO_NAME <__*CLOUDFLARE_ACCOUNT_ID*__>
        gh secret set REPO_OWNER/REPO_NAME <__*CLOUDFLARE_ZONE_ID*__>
        gh secret set REPO_OWNER/REPO_NAME <__*RESOLVER_KV_ID*__>
        gh secret set REPO_OWNER/REPO_NAME <__*RESOLVER_KV_PREVIEW_ID*__>
        gh secret set REPO_OWNER/REPO_NAME <__*ZONES_KV_ID*__>
        gh secret set REPO_OWNER/REPO_NAME <__*ZONES_KV_PREVIEW_ID*__>
    ```

4. Navigate to the initial failed workflow from [deployment step 1](#deployment) in Github Actions and click the "Re-run jobs" dropdown and "Re-run all jobs" selection. The Github workflow will re-run and deploy the cloudflare worker to your account.
