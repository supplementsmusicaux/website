#!/usr/bin/env bash
# Runs the given command, retrying on failure so a transient error (e.g. a
# residual Hygraph rate-limit hit) doesn't require a human to manually
# re-run the workflow.
set -uo pipefail

max_attempts="${MAX_ATTEMPTS:-3}"
retry_delay_seconds="${RETRY_DELAY_SECONDS:-10}"
attempt=1

until [ "$attempt" -gt "$max_attempts" ]; do
  echo "::group::Attempt $attempt/$max_attempts: $*"
  "$@"
  status=$?
  echo "::endgroup::"

  if [ "$status" -eq 0 ]; then
    exit 0
  fi

  echo "::warning::Attempt $attempt/$max_attempts failed (exit $status): $*"
  attempt=$((attempt + 1))
  if [ "$attempt" -le "$max_attempts" ]; then
    sleep "$retry_delay_seconds"
  fi
done

echo "::error::Command failed after $max_attempts attempts: $*"
exit 1
