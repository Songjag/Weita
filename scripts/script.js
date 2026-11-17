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
    project: "Featured projects:\n  VidSight YouTube Analysis Skill\n  CustomAiomysql\n  Video-Installer",
  };

  const appendPrompt = (command) => {
    const prompt = document.createElement("p");
    prompt.className = "command-line";
    prompt.innerHTML = '<span class="prompt">songjag@space</span><span class="path">:~$</span> ';
    const entered = document.createElement("span");
    entered.className = "entered";
    entered.textContent = command;
    prompt.append(entered);
    output.append(prompt);
  };

  const appendResponse = (message) => {
    const response = document.createElement("p");
    response.className = "command-response";
    response.textContent = message;
    output.append(response);
  };

  const showGitHubInfo = async () => {
    const loading = document.createElement("p");
    loading.className = "command-response github-loading";
    loading.textContent = "Loading GitHub profile...";
    output.append(loading);
    try {
      const response = await fetch("https://api.github.com/users/Songjag");
      if (!response.ok) throw new Error(`GitHub profile request failed: ${response.status}`);
      const profile = await response.json();
      loading.remove();

      const info = document.createElement("div");
      info.className = "github-info";
      info.innerHTML = '<img class="github-avatar" alt="GitHub avatar"><div class="github-details"><p class="github-name"><a target="_blank" rel="noreferrer"></a> <span class="github-stats"></span></p><p class="github-bio"></p><p class="github-meta"></p></div>';
      const avatar = info.querySelector(".github-avatar");
      avatar.src = profile.avatar_url;
      avatar.alt = `GitHub avatar for ${profile.login}`;
      const name = info.querySelector(".github-name a");
      name.href = profile.html_url;
      name.textContent = profile.name || profile.login;
      info.querySelector(".github-stats").textContent =
        `@${profile.login} · ${profile.followers} followers · ${profile.following} following`;
      info.querySelector(".github-bio").textContent =
        profile.bio || "I build tools with Python and write down what I learn about Linux, programming, and AI.";
      const meta = [
        profile.company && `company: ${profile.company}`,
        profile.location && `location: ${profile.location}`,
        profile.blog && `website: ${profile.blog}`,
        `${profile.public_repos ?? 0} public repositories`,
        profile.created_at && `joined ${new Date(profile.created_at).getFullYear()}`,
      ].filter(Boolean);
      info.querySelector(".github-meta").textContent = meta.join(" · ");
      output.append(info);
      output.scrollTop = output.scrollHeight;
    } catch (error) {
      loading.textContent = "Unable to load GitHub profile. Visit https://github.com/Songjag";
      console.error(error);
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = input.value.trim().toLowerCase();
    if (!command) return;

    if (command === "clear") {
      output.replaceChildren();
    } else if (command === "info") {
      appendPrompt(command);
      showGitHubInfo();
    } else {
      appendPrompt(command);
      appendResponse(commands[command]
        ?? `Command "${command}" not found. Type help to see available commands.`);
    }

    input.value = "";
    output.scrollTop = output.scrollHeight;
    input.focus();
  });
})();
