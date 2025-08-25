# 🤝 Contributing to Smart Pig DeFi

Welcome to Smart Pig DeFi! We're excited that you're interested in contributing to our decentralized finance platform. This guide will help you get started with contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Contributing Workflow](#contributing-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Security](#security)
- [Documentation](#documentation)
- [Community](#community)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand the standards we expect from our community.

### 🤝 Our Values

- **Respect**: Treat everyone with respect and kindness
- **Inclusion**: Welcome contributions from people of all backgrounds
- **Collaboration**: Work together to build something amazing
- **Quality**: Strive for excellence in everything we do
- **Security**: Prioritize the safety and security of our users

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 22+
- **npm** 10.9.2+
- **Docker** (for containerized development)
- **Git** (latest version)
- **Make** (optional, for convenience commands)

### 🔧 Development Environment Setup

1. **Fork the repository**

   ```bash
   # Click the "Fork" button on GitHub or use GitHub CLI
   gh repo fork guilhermejansen/smart-pig-defi
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/smart-pig-defi.git
   cd smart-pig-defi
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/guilhermejansen/smart-pig-defi.git
   ```

4. **Install dependencies**

   ```bash
   # Using Make (recommended)
   make setup

   # Or manually
   cd frontend && npm ci --legacy-peer-deps
   cd ../backend && npm ci
   ```

5. **Set up environment variables**

   ```bash
   cp .env.example .env
   cp .env.development .env.local
   # Edit the files with your configuration
   ```

6. **Start development environment**

   ```bash
   # Using Docker (recommended)
   make docker-dev

   # Or start services individually
   make dev-backend  # Terminal 1
   make dev-frontend # Terminal 2
   ```

### 🌐 Development URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database Admin**: http://localhost:8080 (Adminer)

## 🔄 Contributing Workflow

### 1. 🎯 Choose What to Work On

- Check our [Issues](https://github.com/guilhermejansen/smart-pig-defi/issues) for open tasks
- Look for issues labeled `good first issue` if you're new
- Check our [Project Board](https://github.com/guilhermejansen/smart-pig-defi/projects) for roadmap items
- Join [Discussions](https://github.com/guilhermejansen/smart-pig-defi/discussions) to propose new ideas

### 2. 🌿 Create a Branch

```bash
# Sync with upstream
git checkout main
git pull upstream main

# Create and switch to a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
# or
git checkout -b docs/documentation-update
```

### 3. 💻 Make Your Changes

- Write clean, readable code
- Follow our [coding standards](#coding-standards)
- Add tests for new functionality
- Update documentation as needed

### 4. 🧪 Test Your Changes

```bash
# Run all tests
make test

# Run specific tests
make test-frontend
make test-backend
make test-e2e

# Check code quality
make lint
make ci  # Simulate CI pipeline locally
```

### 5. 📝 Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages:

```bash
# Format: type(scope): description
git commit -m "feat(auth): add passkey authentication support"
git commit -m "fix(api): resolve user registration bug"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(frontend): improve component structure"
```

#### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `security`: Security improvements

### 6. 📤 Push and Create PR

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub with:

- Clear title and description
- Link to related issues
- Screenshots/GIFs for UI changes
- Test coverage information

## 🎨 Coding Standards

### Frontend (React + TypeScript)

#### File Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI elements
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── styles/             # CSS files
└── __tests__/          # Test files
```

#### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Files**: camelCase (`userService.ts`)
- **Variables/Functions**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **CSS Classes**: kebab-case (`user-profile`)

#### Code Style

```typescript
// ✅ Good
interface UserProfileProps {
  userId: string;
  onUserUpdate: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  onUserUpdate,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Component logic here

  return (
    <div className="user-profile">
      {/* JSX here */}
    </div>
  );
};

// ❌ Avoid
export function userProfile(props: any) {
  // Avoid any type, use proper interfaces
}
```

### Backend (NestJS + TypeScript)

#### Module Structure

```
src/
├── modules/            # Feature modules
│   ├── auth/          # Authentication module
│   ├── users/         # User management
│   └── transactions/  # Transaction handling
├── shared/            # Shared utilities
├── config/            # Configuration
├── decorators/        # Custom decorators
├── guards/            # Auth guards
├── interceptors/      # Request/response interceptors
└── main.ts           # Application entry point
```

#### Naming Conventions

- **Modules**: PascalCase (`AuthModule`)
- **Controllers**: PascalCase with suffix (`UserController`)
- **Services**: PascalCase with suffix (`UserService`)
- **DTOs**: PascalCase with suffix (`CreateUserDto`)
- **Entities**: PascalCase (`User`)

#### Code Style

```typescript
// ✅ Good
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("id") id: string): Promise<UserResponseDto> {
    const user = await this.userService.findById(id);
    return this.userService.toResponseDto(user);
  }
}

// Service example
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }
}
```

### Database

#### Migration Naming

```bash
# Format: TIMESTAMP_descriptive_name.ts
20231201120000_create_user_table.ts
20231201130000_add_stellar_public_key_to_users.ts
```

#### Entity Conventions

```typescript
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: "stellar_public_key", nullable: true })
  stellarPublicKey: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
```

## 🧪 Testing Guidelines

### Frontend Testing

#### Component Tests

```typescript
// UserProfile.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('should display user information', () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };

    render(<UserProfile user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

#### Hook Tests

```typescript
// useUser.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useUser } from "./useUser";

describe("useUser", () => {
  it("should fetch user data", async () => {
    const { result } = renderHook(() => useUser("user-id"));

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
      expect(result.current.loading).toBe(false);
    });
  });
});
```

### Backend Testing

#### Controller Tests

```typescript
// user.controller.spec.ts
describe("UserController", () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it("should return a user", async () => {
    const mockUser = { id: "1", email: "test@example.com" };
    jest.spyOn(service, "findById").mockResolvedValue(mockUser as User);

    const result = await controller.findOne("1");
    expect(result).toEqual(mockUser);
  });
});
```

#### Service Tests

```typescript
// user.service.spec.ts
describe("UserService", () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it("should find a user by id", async () => {
    const mockUser = { id: "1", email: "test@example.com" };
    jest.spyOn(repository, "findOne").mockResolvedValue(mockUser as User);

    const result = await service.findById("1");
    expect(result).toEqual(mockUser);
  });
});
```

### Test Coverage Requirements

- **Minimum coverage**: 80%
- **Critical paths**: 95% (authentication, payments, security)
- **New features**: 100% coverage required

## 📥 Pull Request Process

### 1. 📋 Before Submitting

- [ ] Code follows project standards
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Commit messages follow conventional format
- [ ] No merge conflicts with main branch

### 2. 📝 PR Template

Use our [PR template](.github/pull_request_template.md) and fill out all relevant sections:

- Clear description of changes
- Link to related issues
- Test coverage information
- Screenshots for UI changes
- Breaking changes documentation

### 3. 🔍 Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by at least one maintainer
3. **Security review** for security-related changes
4. **QA testing** for significant changes

### 4. ✅ Merge Requirements

- [ ] All CI checks passing
- [ ] At least one approved review
- [ ] No requested changes
- [ ] Up to date with main branch

## 📝 Issue Guidelines

### 🐛 Bug Reports

Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml):

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment information
- Screenshots/logs if applicable

### ✨ Feature Requests

Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml):

- Clear problem statement
- Proposed solution
- User stories
- Technical specifications
- Acceptance criteria

### 📚 Documentation Issues

Use our [documentation template](.github/ISSUE_TEMPLATE/documentation.yml):

- What documentation needs improvement
- Target audience
- Specific content requirements

## 🔒 Security

### 🚨 Reporting Security Vulnerabilities

**DO NOT** create public issues for security vulnerabilities. Instead:

1. **Email**: security@smartpig.defi
2. **Use our**: [Security template](.github/ISSUE_TEMPLATE/security_vulnerability.yml)
3. **Follow**: [Responsible disclosure guidelines](SECURITY.md)

### 🛡 Security Guidelines

- Never commit secrets, keys, or passwords
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security guidelines
- Use secure coding practices
- Keep dependencies updated

### 🔐 Security Checklist

- [ ] Input validation implemented
- [ ] Output encoding applied
- [ ] Authentication/authorization verified
- [ ] SQL injection prevention
- [ ] XSS prevention measures
- [ ] CSRF protection
- [ ] Secrets management reviewed

## 📚 Documentation

### 📖 Types of Documentation

- **API Documentation**: Swagger/OpenAPI specs
- **User Guides**: How to use features
- **Developer Docs**: Technical implementation details
- **Architecture Docs**: System design and structure

### ✍️ Writing Guidelines

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep documentation up to date
- Use proper markdown formatting

### 📝 Documentation Standards

````markdown
# Title (H1)

Brief description of what this document covers.

## Section (H2)

Content for this section.

### Subsection (H3)

More detailed content.

#### Code Examples

```typescript
// Always include working code examples
const example = "like this";
```
````

#### Important Notes

> Use blockquotes for important information

```

## 🌟 Community

### 💬 Communication Channels
- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Community discussions, Q&A
- **Pull Requests**: Code review and collaboration

### 🎯 Ways to Contribute
- **Code**: Features, bug fixes, optimizations
- **Documentation**: Guides, API docs, tutorials
- **Testing**: Write tests, report bugs, QA
- **Design**: UI/UX improvements, graphics
- **Community**: Help others, answer questions

### 🏆 Recognition
We recognize contributors through:
- **Contributor spotlight** in release notes
- **Hall of fame** in README
- **Special badges** for significant contributions
- **Priority review** for regular contributors

## 🎉 Thank You!

Thank you for contributing to Smart Pig DeFi! Your contributions help make decentralized finance more accessible and secure for everyone.

### 📞 Questions?
- Check our [FAQ](FAQ.md)
- Search existing [issues](https://github.com/guilhermejansen/smart-pig-defi/issues)
- Start a [discussion](https://github.com/guilhermejansen/smart-pig-defi/discussions)
- Contact maintainers: maintainers@smartpig.com

---

**Happy coding! 🚀**
```
