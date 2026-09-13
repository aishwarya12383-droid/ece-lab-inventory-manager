import {
  CircuitBoard,
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  Layers,
  Activity,
} from 'lucide-react';

export default function About() {
  const crudOps = [
    {
      icon: PlusCircle,
      title: 'Create',
      desc: 'Add new components to the inventory with all required details',
      color: 'green',
    },
    {
      icon: Eye,
      title: 'Read',
      desc: 'View component records in a professional, searchable table',
      color: 'blue',
    },
    {
      icon: Pencil,
      title: 'Update',
      desc: 'Modify and update existing component information',
      color: 'orange',
    },
    {
      icon: Trash2,
      title: 'Delete',
      desc: 'Remove components with confirmation dialog before deletion',
      color: 'red',
    },
  ];

  const techStack = [
    { name: 'React', category: 'Frontend' },
    { name: 'Vite', category: 'Build Tool' },
    { name: 'React Router', category: 'Routing' },
    { name: 'Lucide React', category: 'Icons' },
    { name: 'CSS3', category: 'Styling' },
    { name: 'Node.js', category: 'Runtime' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'REST API', category: 'API' },
    { name: 'JSON File', category: 'Database' },
  ];

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h2 className="page-title">About</h2>
          <p className="page-subtitle">Project information and details</p>
        </div>
      </div>

      {/* Hero card */}
      <div className="card about-hero">
        <div className="about-hero-icon">
          <CircuitBoard size={48} />
        </div>
        <h2 className="about-hero-title">ECE Lab Inventory Manager</h2>
        <p className="about-hero-desc">
          The ECE Lab Inventory Manager is a CRUD-based mini web application developed to manage
          electronic components and laboratory equipment efficiently. It allows laboratory
          administrators to add, view, update, delete, search, filter, and monitor electronic
          components.
        </p>
      </div>

      {/* Activity info */}
      <div className="about-info-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Activity size={18} /> Activity</h3>
          </div>
          <div className="about-info-body">
            <div className="about-info-row">
              <span className="about-info-label">Program</span>
              <span className="about-info-value">VSB Skill Vault – Activity 3</span>
            </div>
            <div className="about-info-row">
              <span className="about-info-label">Type</span>
              <span className="about-info-value">Mini Web Application – CRUD-Based</span>
            </div>
            <div className="about-info-row">
              <span className="about-info-label">Department</span>
              <span className="about-info-value">Electronics & Communication Engineering</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Layers size={18} /> Technology Stack</h3>
          </div>
          <div className="tech-stack-list">
            {techStack.map((tech) => (
              <div className="tech-stack-item" key={tech.name}>
                <span className="tech-stack-name">{tech.name}</span>
                <span className="tech-stack-category">{tech.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CRUD cards */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">CRUD Implementation</h3>
        </div>
        <div className="crud-grid">
          {crudOps.map((op) => {
            const Icon = op.icon;
            return (
              <div className={`crud-card crud-card-${op.color}`} key={op.title}>
                <div className="crud-card-icon">
                  <Icon size={24} />
                </div>
                <h4 className="crud-card-title">{op.title}</h4>
                <p className="crud-card-desc">{op.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
