# ResumeTerminal

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-15.0.0-blue)
![React](https://img.shields.io/badge/react-19.0.0-blue)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-^3.0-blue)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-^1.0-blue)

**ResumeTerminal** is an open-source, command-line-based personal resume application that emulates a modern terminal interface. Designed for tech-savvy individuals, product owners, and developers, it allows users to navigate through resume sections such as Employment History, Projects, and Skills using standard terminal commands.

---

## 🖥️ Features

- **Command Navigation**: Use familiar commands like `cd`, `ls`, and `help` to explore different sections of your resume.
- **Interactive Help Menu**: Access a comprehensive list of available commands and their descriptions.
- **Section-Specific Commands**: Display detailed information with commands like `view projects` and `show skills`.
- **Hierarchical Navigation**: Navigate through directories using `cd` and `cd ..`, mimicking a real terminal experience.
- **Customizable Configuration**: Easily edit and configure your resume details through JSON or YAML configuration files.
- **Cohesive Design**: Styled with Tailwind CSS and shadcn/ui components for a polished and consistent user interface.
- **Built with Modern Technologies**: Developed using Next.js 15 and React 19 for optimal performance and scalability.
- **Open Source**: Contribute to the project or customize it to fit your personal branding.

---

## 🚀 Demo

[Live Demo](https://www.nickneely.dev/)

---

## 📦 Installation

### Prerequisites

- **Node.js** (v16.0.0 or later)
- **npm** or **yarn**

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/nick-neely/resume-terminal.git
   cd resume-terminal
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Using yarn:

   ```bash
   yarn install
   ```

3. **Configure Resume Data**

   - Copy the sample configuration file:

     ```bash
     cp config/sample.resume.json config/resume.json
     ```

   - Edit `config/resume.json` with your personal resume details following the [Schema Design](#schema-design).

4. **Run the Development Server**

   Using npm:

   ```bash
   npm run dev
   ```

   Using yarn:

   ```bash
   yarn dev
   ```

5. **Open in Browser**

   Navigate to `http://localhost:3000` to view ResumeTerminal in action.

---

## 🛠️ Usage

### Navigating the Resume

- **List Directory Contents**

  ```bash
  ls
  ```

- **Change Directory**

  ```bash
  cd projects
  ```

- **View File Contents**

  ```bash
  cat description.txt
  ```

- **Display Help**

  ```bash
  help
  help [command]
  ```

### Custom Commands

Define custom commands in `config/resume.json` under the `customCommands` section. For example:

```json
{
  "customCommands": [
    {
      "command": "social",
      "description": "Displays social media links.",
      "action": "display",
      "payload": {
        "Twitter": "https://twitter.com/yourhandle",
        "LinkedIn": "https://linkedin.com/in/yourhandle"
      }
    }
  ]
}
```

Now, you can use the `social` command to display your social media links.

---

## 📝 Configuration

### Resume Data

Customize your resume by editing the `config/resume.json` file. Follow the [Schema Design](#schema-design) to structure your data correctly.

### Application Settings

Adjust settings such as theme, prompt symbol, and welcome message in the `settings` section of the configuration file:

```json
{
  "settings": {
    "theme": "dark",
    "initialDirectory": "/",
    "promptSymbol": "$",
    "dateFormat": "MMM YYYY",
    "welcomeMessage": "Welcome to YourName's Resume!",
    "enableSound": false
  }
}
```

---

## 📚 Schema Design

Refer to the [Schema Design Document](./docs/SchemaDesign.md) for detailed information on structuring your resume data and configuration files.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add Your Feature"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

Please read our [Contribution Guidelines](./CONTRIBUTING.md) for more details.

---

## 🧾 License

This project is licensed under the [MIT License](./LICENSE).

---

## 📫 Contact

- **Email**: <contact@nickneely.dev>
- **LinkedIn**: [nick-neely](https://www.linkedin.com/in/nick-neely/)
- **GitHub**: [nick-neely](https://github.com/nick-neely)

---

## 🖥️ Screenshots

_Example of the terminal interface displaying resume sections._

---

## 🔧 Tech Stack and Packages

- **Frameworks & Libraries**:

  - [Next.js 15](https://nextjs.org/) - Server-side rendering and routing
  - [React 19](https://reactjs.org/) - Building UI components
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
  - [shadcn/ui](https://shadcn.com/ui) - Pre-built UI components

- **Testing**:

  - [Vitest](https://vitest.dev/)
  - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

- **Tools**:
  - [TypeScript](https://www.typescriptlang.org/)
  - [ESLint](https://eslint.org/)
  - [Prettier](https://prettier.io/)

---

Thank you for using **ResumeTerminal**! We hope it provides a unique and interactive way to showcase your professional credentials.
