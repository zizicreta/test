import huggingface_hub
from huggingface_hub import snapshot_download

snapshot_download(
    repo_id="zizicreta9045/Gemma-3-4B-Fin-QA-Reasoning-squard_kor_v1",
    local_dir="c:/ai/models/gemma3-4b-kor-v1",
    local_dir_use_symlinks=False
)
