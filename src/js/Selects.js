import { GithubUser } from "./gitHubUser.js";

export class Selects {
  constructor(root) {
    this.root = document.querySelector(root);
    this.loadData();

  }

  loadData() {
    this.selections = JSON.parse(localStorage.getItem('@github-conect:')) || []
  }

  save() {
    localStorage.setItem('@github-conect:', JSON.stringify(this.selections))
  }

  async add(username) {
    try {

      const userExist = this.selections.find( selected => selected.login === username)

      if(userExist) {
        throw new Error('user has already been registered')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('User not found!!!!')
      }

      this.selections = [user, ...this.selections]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredSelections = this.selections.filter((entry) =>
    entry.login !== user.login)

    this.selections = filteredSelections;
    this.update();
    this.save();
  }
}

export class SelectsView extends Selects {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector('table tbody');

    this.update();
    this.onSearch();
  }
  
  onSearch() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

       this.add(value)
    }
  }

  update() {
    this.removeTRs();

    this.selections.forEach((user) => {
      const row = this.createRow();

      row.querySelector('.user img').src =` https://github.com/${user.login}.png`;
      row.querySelector('.user img').alt =` ${user.name} s image`;
      row.querySelector('.user a').href = `https://github.com/${user.login}`;
      row.querySelector('.user a p').textContent = user.name;
      row.querySelector('.user a span').textContent = user.login;
      row.querySelector('.user a span').textContent = user.login;
      row.querySelector('.repositories').textContent = user.public_repos;
      row.querySelector('.followers').textContent = user.followers;

      row.querySelector('.remove').onclick = () => {
        const erase = confirm('Are you sure you want to delete this line');

        if(erase) {
          this.delete(user)
        }
      }

      this.tbody.append(row)

    })
  }

  createRow() {
    const tr = document.createElement("tr");

    const trContent = `
        <td class="user">
          <img src="https://github.com/otavioxavier.png" alt="Imagem de Otavio Xavier">
          <a href="https://github.com/otavioxavier" target="_blank">
            <p>Otavio Xavier</p>
            <span>otavioxavier</span>
          </a>
        </td>
        <td class="repositories">
     54
        </td>
        <td class="followers">
2
        </td>
        <td>
          <button class="remove">&times;</button>
        </td>
    `;
    tr.innerHTML = trContent;

    return tr;
  }

  removeTRs() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}