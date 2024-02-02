#!/bin/bash

# Assign the first and second argument to variables
region=$1
policy_store_id=$2

# Validate input
if [[ -z "$region" || -z "$policy_store_id" ]]; then
  echo "Usage: $0 <region> <policy_store_id>"
  exit 1
fi

# File paths (update these paths to your actual file locations)
file1_path="amplify/backend/function/ItemsAPIHandlerFn/src/index.js"
file2_path="amplify/backend/function/DeviceAPIHandlerFn/src/index.js"
file3_path="amplify/backend/function/awsiotavpwebappAVPPermissionsLayer/lib/nodejs/permissions.mjs"

# Update region in File1
perl -pi -e "s/const REGION = '.*';/const REGION = '$region';/" "$file1_path"
echo "Updated $file1_path"

# Update region in File2
perl -pi -e "s/const REGION = '.*';/const REGION = '$region';/" "$file2_path"
echo "Updated $file2_path"

# Update region and policy_store_id in File3
perl -pi -e "s/const REGION = \".*\";/const REGION = \"$region\";/" "$file3_path"
perl -pi -e "s/const POLICY_STORE_ID = \".*\";/const POLICY_STORE_ID = \"$policy_store_id\";/" "$file3_path"
echo "Updated $file3_path"

echo "Variables updated successfully..."

echo "Initializing Amplify project"
amplify init

echo "Pushing backend to the cloud"
amplify push -y

echo "Publishing frontend application"
amplify publish -y

