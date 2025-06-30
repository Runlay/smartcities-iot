import os
import subprocess
import platform

# Get absolute path to the current folder
current_dir = os.path.abspath(os.getcwd())

# Get absolute path to the /pddl folder (neighbor of src/)
pddl_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "pddl"))

# Adjust path for Docker on Windows
if platform.system() == "Windows":
    # Convert to Unix-style path for Docker
    if pddl_dir[1:3] == ":\\":
        drive = pddl_dir[0].lower()
        path = pddl_dir[2:].replace("\\", "/")
        docker_path = f"/{drive}{path}"
    else:
        docker_path = pddl_dir.replace("\\", "/")
else:
    docker_path = pddl_dir

# Build the Docker command
cmd = [
    "docker",
    "run",
    "--rm",
    "-v",
    f"{docker_path}:/data",
    "fast-downward",
    "/data/domain.pddl",
    "/data/problem.pddl",
    "--search",
    "lazy_greedy([ff()], preferred=[ff()])",
]

# Run the command and stream the output
try:
    result = subprocess.run(cmd, check=True, text=True)
except subprocess.CalledProcessError as e:
    print("Docker run failed.")
    print(e)
