import os
import subprocess
import platform
import re

def run_fd_docker():


    cmd = [
        "sudo",
        "docker",
        "run",
        "--rm",
        "-v", "smartcities-iot_pddl_data:/data",
        "fast-downward",
        "/data/domain.pddl",
        "/data/problem.pddl",
        "--search",
        "lazy_greedy([ff()], preferred=[ff()])",
    ]

    try:
        result = subprocess.run(cmd, check=True, text=True, capture_output=True)
        return result.stdout.splitlines()
    except subprocess.CalledProcessError as e:
        print("❌ Fehler beim Ausführen von Fast Downward:")
        print("STDOUT:\n", e.stdout)
        print("STDERR:\n", e.stderr)
        raise e
