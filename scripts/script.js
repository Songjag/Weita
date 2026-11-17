(() => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-button");
  const form = document.getElementById("terminal-form");
  const output = document.getElementById("command-output");
  const input = document.getElementById("terminal-input");
  const library = document.getElementById("resource-library");

  menuButton?.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  if (library) {
    fetch("data/share.json")
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load resource data: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        for (const share of data.shares ?? []) {
          const group = document.createElement("div");
          group.className = "library-group";
          const details = document.createElement("details");
          const summary = document.createElement("summary");
          summary.className = "library-item";
          const marker = document.createElement("span");
          marker.textContent = "▸";
          const name = document.createElement("span");
          name.textContent = share.name;
          const arrow = document.createElement("b");
          arrow.textContent = "↗";
          summary.append(marker, name, arrow);
          const children = document.createElement("div");
          children.className = "library-children";
          details.append(summary, children);
          group.append(details);
          for (const item of share.items ?? []) {
            const link = document.createElement("a");
            link.href = item.url;
            link.textContent = item.name;
            children.append(link);
          }
          library.append(group);
        }
      })
      .catch((error) => {
        console.error(error);
        library.textContent = "Unable to load the resource library.";
      });
  }

  if (!form || !output || !input) return;

  const commands = {
    help: "Available commands:\n  ⓘ help       show this help\n  ⓘ info       GitHub profile\n  ▣ project    show projects\n  □ clear      clear the screen",
    project: "Featured projects:\n  ElysiaBot      Discord automation\n  VidSight       YouTube video analysis\n  Elysia Live2D  interactive avatar experiment",
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = input.value.trim().toLowerCase();
    if (!command) return;

    if (command === "clear") {
      output.replaceChildren();
    } else {
      const prompt = document.createElement("p");
      prompt.className = "command-line";
      prompt.innerHTML = '<span class="prompt">songjag@space</span><span class="path">:~$</span> ';
      const entered = document.createElement("span");
      entered.className = "entered";
      entered.textContent = command;
      prompt.append(entered);

      const response = document.createElement("p");
      response.className = "command-response";
      response.textContent = commands[command]
        ?? (command === "info"
          ? "GitHub profile: https://github.com/songjag"
          : `Command "${command}" not found. Type help to see available commands.`);
      output.append(prompt, response);
    }

    input.value = "";
    output.scrollTop = output.scrollHeight;
    input.focus();
  });
})();
