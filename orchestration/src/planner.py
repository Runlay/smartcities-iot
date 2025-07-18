import os
import subprocess
import platform
import re


def run_fd_docker():
    # cmd = [
    #     "sudo",
    #     "docker",
    #     "run",
    #     "--rm",
    #     "-v",
    #     "smartcities-iot_pddl_data:/data",
    #     "fast-downward",
    #     "/data/domain.pddl",
    #     "/data/problem.pddl",
    #     "--search",
    #     "lazy_greedy([ff()], preferred=[ff()])",
    # ]

    # for balena only
    cmd = [
        "docker",
        "run",
        "--rm",
        "-v",
        "2243607_pddl_data:/data",  # make sure this volume exists in your balena environment
        "335bae47c8fa",  # image ID
        "/data/domain.pddl",
        "/data/problem.pddl",
        "--search",
        "lazy_greedy([ff()], preferred=[ff()])",
    ]

    try:
        result = subprocess.run(cmd, check=True, text=True, capture_output=True)

        # Extract the plan from stdout
        plan_lines = []
        lines = result.stdout.splitlines()
        collecting = False

        for line in lines:
            if "Solution found!" in line:
                collecting = True
                continue
            if collecting:
                stripped = line.strip()
                # Only collect lines that look like action lines
                if (
                    stripped
                    and not stripped.startswith("[")
                    and not stripped.startswith("Plan")
                ):
                    if "  (" in stripped or stripped.endswith(")") or "-" in stripped:
                        plan_lines.append(stripped)
                elif (
                    stripped.startswith("Plan length") or "search exit code" in stripped
                ):
                    break

        return plan_lines
    except subprocess.CalledProcessError as e:
        print("Fehler beim Ausführen von Fast Downward:")
        print("STDOUT:\n", e.stdout)
        print("STDERR:\n", e.stderr)
        raise e
