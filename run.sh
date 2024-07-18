#!/bin/bash

# Initialize array of package managers to check
PACKAGE_MANAGERS=("yarn" "pnpm" "npm")

# Variable to store detected package manager
package_manager=""
package_manager_version=""

# Check for supported package managers

# Loop through each package manager
for pkg_mgr in "${PACKAGE_MANAGERS[@]}"; do
  if command -v "$pkg_mgr" &>/dev/null; then
    package_manager="$pkg_mgr"
    package_manager_version="$($pkg_mgr --version)"
    break
  fi
done

# Check if a package manager was found
if [ -n "$package_manager" ]; then
  echo "Package manager has been installed: $package_manager $package_manager_version"
else
  echo "No supported package manager or tool found."
fi

# aptos
aptos_version=$(aptos --version)
if [ $? -ne 0 ]; then
  echo "Aptos is not installed."
else
  echo "Aptos has been installed: $aptos_version"
fi
# aptos move
move_version=$(aptos move --version)

if [ $? -ne 0 ]; then
  echo "Move is not installed."
else
  echo "Move has been installed: $move_version"
fi

nodejs_version=$(node --version)
# echo $move_version

if [ $? -ne 0 ]; then
  echo "Nodejs is not installed."
else
  echo "Nodejs has been installed: node $nodejs_version"

fi

# ----------------------------------------
