import SectionHeader, { headingFont } from "./SectionHeader";

const modules = [
  { short: "Linux", title: "Linux Operating System Prerequisites", focus: "Build the foundation for server and container environments", lab: "Guided Administration Lab", points: ["Linux operating system fundamentals and architecture", "Basic commands, file and directory management", "Users and permissions", "Processes, system administration concepts, and networking fundamentals"] },
  { short: "Python", title: "Python Basics", focus: "Automate and script infrastructure workflows", lab: "Python Automation Lab", points: ["Python syntax, variables, data types, and operators", "Input and output, conditional statements, and loops", "Functions and basic data structures", "Strong foundation for programming, data science, AI, and machine learning"] },
  { short: "Networking", title: "Networking", focus: "Connect and troubleshoot enterprise infrastructure", lab: "Guided Networking Lab", points: ["TCP/IP, IP addressing, routing, and DNS", "VLANs, ports, and protocols", "Ethernet and InfiniBand fundamentals"] },
  { short: "Data Center", title: "Data Center, Rack, & Physical Infrastructure", focus: "Manage the physical infrastructure supporting modern data centers", lab: "Infrastructure Lab", points: ["Server racks, components, and organization", "Cooling and power distribution", "Cable management and security"] },
  { short: "DGX", title: "Introduction to DGX", focus: "Understand accelerated computing and GPU hardware", lab: "DGX Administration Lab", points: ["How GPUs allow parallel processing and accelerated computing in AI workloads", "NVIDIA DGX architecture and system components"] },
  { short: "BCM", title: "BCM", focus: "Provision and manage cluster systems", lab: "BCM Administration Lab", points: ["How Base Command Manager is used to manage clusters of systems", "Head-node administration and compute-node provisioning"] },
  { short: "Containers", title: "Containerization", focus: "Deploy GPU-enabled applications", lab: "Container Deployment Lab", points: ["How modern applications are packaged and deployed using containers", "Docker, containerd, images, registries, volumes, and networking", "Dockerfiles and NVIDIA Container Runtime for GPU-enabled workloads"] },
  { short: "SLURM", title: "SLURM", focus: "Manage workloads across clusters", lab: "SLURM Cluster Lab", points: ["Using SLURM as a workload manager for clusters", "Partitions, nodes, and GPU resource allocation"] },
  { short: "Kubernetes", title: "Kubernetes", focus: "Administer container orchestration", lab: "Kubernetes Administration Lab", points: ["Container orchestration fundamentals for managing workloads across servers", "Cluster administration and GPU workload routing"] },
  { short: "Run:ai", title: "Run:ai", focus: "Operate enterprise GPU orchestration", lab: "Run:ai Administration Lab", points: ["Dynamically allocate, schedule, and manage GPU resources across on-prem, cloud, and hybrid environments", "Maximize GPU utilization, pool resources, and run training, inference, and research workloads"] },
];

export default function LearningTracksSection() {
  return (
    <section id="tracks" className="bg-[#f5fafb] py-16 sm:py-24" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <SectionHeader
          tag="Learning Roadmap"
          title="Your DGX Learning Journey"
          text="Ten structured modules take you from server prerequisites to enterprise GPU orchestration, each with a guided lab."
        />

        {/* Stepper */}
        <div className="flex overflow-x-auto pb-8">
          {modules.map((m, i) => (
            <div key={m.short} className="relative flex-1 min-w-[96px] text-center text-xs sm:text-sm font-bold text-[#013D54]">
              {i < modules.length - 1 && (
                <span className="absolute top-[22px] left-1/2 w-full h-[3px] bg-[#cfe3a0]" />
              )}
              <span className="relative z-10 mx-auto mb-2 flex w-11 h-11 items-center justify-center rounded-full bg-[#76B900] text-[#00222F] border-4 border-[#f5fafb]">
                {i + 1}
              </span>
              {m.short}
            </div>
          ))}
        </div>

        {/* Module cards */}
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          {modules.map((m, i) => (
            <div
              key={m.title}
              className="group relative overflow-hidden bg-white border border-[#013D54]/10 rounded-3xl p-6 sm:p-7 flex flex-col gap-3.5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#76B900] hover:shadow-2xl hover:shadow-[#013D54]/10"
            >
              <span className="absolute right-5 -top-1 text-[120px] leading-none font-black text-[#013D54]/5 select-none" style={headingFont}>
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative flex items-center gap-3.5">
                <span className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#013D54] to-[#00698A] text-[#9BD92E] font-extrabold flex items-center justify-center shadow-lg shadow-[#013D54]/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#013D54] leading-snug" style={headingFont}>
                  {m.title}
                </h3>
              </div>

              <p className="relative text-sm font-bold text-[#3C6A00]">{m.focus}</p>

              <ul className="relative flex flex-col gap-2 flex-1">
                {m.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm text-[#4a6b7a]">
                    <span className="mt-2 w-2 h-2 shrink-0 rounded-full bg-[#76B900]" />
                    {p}
                  </li>
                ))}
              </ul>

              <span className="relative self-start bg-[#eaf6fa] border border-[#cde6ee] text-[#013D54] rounded-xl px-3.5 py-2 text-xs font-bold">
                {m.lab}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}