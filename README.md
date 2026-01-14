# LUMLI

Layered

Unified

Model

Logic

Inspector

A UML class diagram editor built with TypeScript and D3.js. Create class diagrams based on a simple JSON entry, visualize/edit it.

## 🚀 Features

### Core Functionality
- **Interactive Class Creation** - Add and customize UML classes with properties and methods
- **Drag & Drop Relationships** - Create inheritance and implementation relationships visually
- **Real-time Editing** - Modify class names, variables, and methods on the fly
- **Zoom & Pan** - Navigate large diagrams with smooth zooming and panning controls
- **Visual Feedback** - Animated relationship creation and hover states

### UML-Specific Features
- **Class Structure** - Support for public, private, and protected members
- **Relationship Types** - Inheritance (`extends`) and interface implementation (`implements`)
- **Standard Notation** - Proper UML syntax and visual representation
- **Multi-compartment Classes** - Organized sections for attributes and operations

### Technical Highlights
- **TypeScript** - Full type safety and modern development experience
- **D3.js** - Powerful data visualization and manipulation
- **SVG-based** - Scalable, crisp graphics at any zoom level
- **Responsive Design** - Works on desktop and tablet devices

## 🛠️ Tech Stack

- **Frontend**: TypeScript, D3.js, SVG
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features
- **Package Manager**: npm

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd uml-diagram-editor

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## 📐 Supported UML Elements

### Class Structure
```typescript
{
  name: "ClassName",
  extends: "SuperClass",     // Inheritance
  implements: "Interface",   // Interface implementation
  public: {
    variables: { "name": "string", "age": "number" },
    methods: ["getName(): string", "setName(name: string): void"]
  },
  private: {
    variables: { "id": "number" },
    methods: ["generateId(): number"]
  },
  protected: {
    variables: { "internalState": "boolean" },
    methods: ["validate(): boolean"]
  }
}
```

### Relationship Types
- **Inheritance** (`extends`) - Solid line with hollow arrowhead
- **Interface Implementation** (`implements`) - Dashed line with hollow arrowhead

## 🎨 Usage Examples

### Creating a Simple Class Hierarchy
1. Add an `Animal` class with public methods `speak()` and `move()`
2. Add a `Mammal` class that extends `Animal`
3. Add a `Dog` class that extends `Mammal`
4. Use link mode to connect them with inheritance relationships

### Modeling Interfaces
1. Create an `IVehicle` interface with methods `start()` and `stop()`
2. Create a `Car` class that implements `IVehicle`
3. Connect with implementation relationship

## 🌟 Why?

### For Developers
- Quick prototyping of class structures
- Documentation generation
- Code visualization before implementation

### For Architects
- System design and planning
- Communication of complex relationships
- Documentation of existing systems

## 🚧 Roadmap

### Planned Features (after MVP)
- [ ] **Export Options** - PNG, SVG, and JSON export
- [ ] **Import from Code** - Parse existing TypeScript/Java classes
- [ ] **Multiple Diagram Types** - Sequence diagrams, use case diagrams
- [ ] **Templates** - Common design patterns and architectures
- [ ] **Validation** - UML syntax and relationship validation
- [ ] **Keyboard Shortcuts** - Faster editing workflow
- [ ] **Collaboration** - Real-time multi-user editing

### Future Enhancements
- **Code Generation** - Generate class skeletons from diagrams
- **Version History** - Track changes and revert modifications
- **Plugins** - Extensible architecture for custom features
- **Themes** - Customizable color schemes and styles

## 🙏 Acknowledgments

- **D3.js** community for the powerful visualization library
- **UML** specification creators for the standardized notation
- **TypeScript** for the excellent development experience
- Join our [discussions](../../discussions)

---

**Happy Diagramming!** 🎉

*Create, visualize, and share your software designs with ease.*
