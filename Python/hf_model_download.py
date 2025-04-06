import huggingface_hub
from huggingface_hub import snapshot_download

snapshot_download(
    repo_id="google/gemma-3-1b-it",
    local_dir="c:/ai/models/gemma3-1b-LIM",
    local_dir_use_symlinks=False
)
