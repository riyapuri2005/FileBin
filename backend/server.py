from pathlib import Path
from stat import filemode
from typing import Dict, Union

from typing import List
from fastapi import Form, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

all_files_relative = Path("./files/")
all_files_absolute = all_files_relative.absolute()
all_files_absolute.mkdir(parents=True, exist_ok=True)
base_app = FastAPI()
base_app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"],  # Or use ["*"] to allow all (not recommended in production)
    allow_credentials=True, allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


def file_metadata(path: Path) -> Dict[str, Union[str, bool]]:
    stat = path.stat()
    return {"name": path.name, "path": path.relative_to(all_files_relative).as_posix(), "parent": path.relative_to(all_files_relative).parent.as_posix(), "created": stat.st_ctime, "modified": stat.st_mtime, "accessed": stat.st_atime, "size": stat.st_size, "permission": filemode(stat.st_mode), "is_file": path.is_file(), "is_dir": path.is_dir(), }


def walk_directory(path: Path) -> Dict:
    data = file_metadata(path)
    if path.is_dir():
        data["children"] = [walk_directory(child) for child in path.iterdir()]
    return data


def file_streamer(file):
    with file.open("rb") as f:
        yield from f


## Fetch all file info
@base_app.get("/api/all-files")
async def _all_files_info():
    return walk_directory(all_files_relative)


## Download a file
@base_app.get("/api/download/{file_path:path}")
async def _download_single_file(file_path: str):
    file = all_files_absolute.resolve() / file_path
    if not file.exists() or not file.is_file():
        return JSONResponse({"allowed": False, "notification": "File not found"})
    response = StreamingResponse(file_streamer(file), media_type="application/octet-stream")
    response.headers["Content-Disposition"] = f"attachment; filename={file.name}"
    return response


@base_app.post("/api/upload")
async def _upload_multiple_files(location: str = Form(...), uploaded_files: List[UploadFile] = File(...)):
    folder_path = all_files_absolute.resolve() / location
    notifications = []
    for uploaded_file in uploaded_files:
        file_path = (folder_path / uploaded_file.filename)
        if file_path.exists():
            notifications.append({"filename": uploaded_file.filename, "allowed": False, "notification": "Filename already exists"})
            continue
        with file_path.open("wb") as f:
            f.write(await uploaded_file.read())
    return JSONResponse(notifications)


## Create a folder
@base_app.post("/api/create-folder")
async def _create_single_folder(location: str = Form(...), folder_name: str = Form(...)):
    folder_path = all_files_absolute.resolve() / location / folder_name
    if folder_path.exists():
        return JSONResponse({"allowed": False, "notification": "Folder already exists"})
    else:
        folder_path.mkdir()
        return JSONResponse({"allowed": True, "notification": "Folder created successfully"})

