#!/bin/bash

region=$1
policy_store_id=$2
checkpoint_file=".deploy_checkpoint"


# Validate input
if [[ -z "$region" || -z "$policy_store_id" ]]; then
  echo "Usage: $0 <region> <policy_store_id>"
  exit 1
fi

export AWS_DEFAULT_REGION=$region

# Function to update checkpoint
update_checkpoint() {
  echo "$1" > "$checkpoint_file"
}

# Function to check if a step has been completed
has_completed() {
  [[ -f "$checkpoint_file" ]] && grep -q "$1" "$checkpoint_file"
}

# Checkpoint names for each step
init_checkpoint="amplify_init_completed"
push_checkpoint="amplify_push_completed"
install_checkpoint="npm_install_completed"
publish_checkpoint="amplify_publish_completed"
add_device_checkpoint="add_device_completed"

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

# Run steps with checkpoints
if ! has_completed $init_checkpoint; then
  echo "Initializing Amplify project"
  amplify init && update_checkpoint $init_checkpoint
fi

if ! has_completed $push_checkpoint; then
  echo "Pushing backend to the cloud"
  amplify push -y && update_checkpoint $push_checkpoint
fi

if ! has_completed $install_checkpoint; then
  echo "Installing project dependencies"
  npm install && update_checkpoint $install_checkpoint
fi

if ! has_completed $publish_checkpoint; then
  echo "Publishing frontend application"
  amplify publish -y && update_checkpoint $publish_checkpoint
fi

if ! has_completed $add_device_checkpoint; then
  echo "Adding device to user relationships"
  aws dynamodb batch-write-item --request-items file://users.json --region $region && update_checkpoint $add_device_checkpoint
fi

echo "Deployment completed successfully."

