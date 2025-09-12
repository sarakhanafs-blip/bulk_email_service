// 'use client';

// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Search, MapPin, Filter, Users, CheckCircle } from 'lucide-react';

// interface Agent {
//   id: string;
//   companyName: string;
//   agentName: string;
//   email: string;
//   location: string;
//   specialties: string[];
// }

// // ...existing code...

// interface AgentSelectionProps {
//   onSelectionChange?: (agents: Agent[]) => void;
// }

// export function AgentSelection({ onSelectionChange }: AgentSelectionProps) {
//   const [agents, setAgents] = useState<Agent[]>([]);

//   useEffect(() => {
//     fetch('/api/agents')
//       .then(res => res.json())
//       .then(data => setAgents(data));
//   }, []);
//   const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedState, setSelectedState] = useState<string>('all');
//   const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

//   const states = Array.from(new Set(agents.map(agent => agent.location)));
//   const specialties = Array.from(new Set(agents.flatMap(agent => agent.specialties)));

//   const filteredAgents = agents.filter(agent => {
//     const searchTermLower = searchTerm.toLowerCase();
//     const matchesSearch = 
//       (agent.companyName?.toLowerCase() ?? '').includes(searchTermLower) ||
//       (agent.agentName?.toLowerCase() ?? '').includes(searchTermLower) ||
//       (agent.location?.toLowerCase() ?? '').includes(searchTermLower);
//     const matchesState = selectedState === 'all' || agent.location === selectedState;
//     const matchesSpecialty = selectedSpecialty === 'all' || agent.specialties?.includes(selectedSpecialty);
    
//     return matchesSearch && matchesState && matchesSpecialty;
//   });

//   const handleAgentToggle = (agentId: string) => {
//     setSelectedAgents(prev => 
//       prev.includes(agentId) 
//         ? prev.filter(id => id !== agentId)
//         : [...prev, agentId]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedAgents.length === filteredAgents.length) {
//       setSelectedAgents([]);
//     } else {
//       setSelectedAgents(filteredAgents.map(agent => agent.id));
//     }
//   };

//   // Notify parent about current selected agent objects
//   useEffect(() => {
//     if (!onSelectionChange) return;
//     const selected = agents.filter(a => selectedAgents.includes(a.id));
//     onSelectionChange(selected);
//   }, [agents, selectedAgents, onSelectionChange]);

//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Select Freight Agents</h2>
//           <p className="text-gray-600">Choose agents by location for your bulk freight queries</p>
//         </div>
//         <Badge variant="secondary" className="text-sm">
//           {selectedAgents.length} Selected
//         </Badge>
//       </div>

//       {/* Filters Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Filter className="h-5 w-5" />
//             Filter Agents
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="search">Search Agents</Label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="search"
//                   placeholder="Search by name or location..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <Label>Country</Label>
//               <Select value={selectedState} onValueChange={setSelectedState}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select country" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Countries</SelectItem>
//                   {states.map(state => (
//                     <SelectItem key={state} value={state}>{state}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Specialty</Label>
//               <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select specialty" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Specialties</SelectItem>
//                   {specialties.map(specialty => (
//                     <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
          
//           <div className="flex justify-between items-center mt-4 pt-4 border-t">
//             <Button 
//               variant="outline" 
//               onClick={handleSelectAll}
//               className="flex items-center gap-2"
//             >
//               <Users className="h-4 w-4" />
//               {selectedAgents.length === filteredAgents.length ? 'Deselect All' : 'Select All'}
//             </Button>
//             <span className="text-sm text-gray-600">
//               Showing {filteredAgents.length} of {agents.length} agents
//             </span>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Agents Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filteredAgents.map(agent => (
//           <Card 
//             key={agent.id} 
//             className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
//               selectedAgents.includes(agent.id) 
//                 ? 'ring-2 ring-blue-500 bg-blue-50' 
//                 : 'hover:bg-gray-50'
//             }`}
//             onClick={() => handleAgentToggle(agent.id)}
//           >
//             <CardHeader className="pb-3">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center gap-3">
//                   <Checkbox 
//                     checked={selectedAgents.includes(agent.id)}
//                     onChange={() => handleAgentToggle(agent.id)}
//                   />
//                   <div>
//                     <CardTitle className="text-lg">{agent.companyName}</CardTitle>
//                     <CardDescription className="flex items-center gap-1">
//                       <span className="text-sm text-gray-600">{agent.agentName}</span>
//                     </CardDescription>
//                     <CardDescription className="flex items-center gap-1">
//                       <MapPin className="h-3 w-3" />
//                       {agent.location}
//                     </CardDescription>
//                   </div>
//                 </div>
//                 {selectedAgents.includes(agent.id) && (
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-600 mb-2">Specialties:</p>
//                   <div className="flex flex-wrap gap-1">
//                     {agent.specialties?.map(specialty => (
//                       <Badge key={specialty} variant="secondary" className="text-xs">
//                         {specialty}
//                       </Badge>
//                     )) || (
//                       <Badge variant="secondary" className="text-xs">
//                         No specialties listed
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Selection Summary */}
//       {selectedAgents.length > 0 && (
//         <Card className="bg-green-50 border-green-200">
//           <CardHeader>
//             <CardTitle className="text-green-800 flex items-center gap-2">
//               <CheckCircle className="h-5 w-5" />
//               Selection Summary
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//               <div>
//                 <p className="font-semibold text-green-800">Total Agents Selected</p>
//                 <p className="text-2xl font-bold text-green-600">{selectedAgents.length}</p>
//               </div>
//               <div>
//                 <p className="font-semibold text-green-800">Coverage Countries</p>
//                 <p className="text-2xl font-bold text-green-600">
//                   {new Set(filteredAgents.filter(a => selectedAgents.includes(a.id)).map(a => a.location)).size}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }






'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Filter, Users, CheckCircle, Phone, Mail } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  country: string;
}

interface AgentSelectionProps {
  onSelectionChange?: (agents: Agent[]) => void;
}

export function AgentSelection({ onSelectionChange }: AgentSelectionProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // Fetch agents
  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => setAgents(data));
  }, []);

  const countries = Array.from(new Set(agents.map(agent => agent.country)));

  const filteredAgents = agents.filter(agent => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      (agent.company?.toLowerCase() ?? '').includes(searchTermLower) ||
      (agent.name?.toLowerCase() ?? '').includes(searchTermLower) ||
      (agent.city?.toLowerCase() ?? '').includes(searchTermLower) ||
      (agent.country?.toLowerCase() ?? '').includes(searchTermLower);

    const matchesCountry = selectedCountry === 'all' || agent.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  const handleAgentToggle = (agentId: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAgents.length === filteredAgents.length) {
      setSelectedAgents([]);
    } else {
      setSelectedAgents(filteredAgents.map(agent => agent.id));
    }
  };

  // Notify parent about selected agent objects
  useEffect(() => {
    if (!onSelectionChange) return;
    const selected = agents.filter(a => selectedAgents.includes(a.id));
    onSelectionChange(selected);
  }, [agents, selectedAgents, onSelectionChange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Select Freight Agents</h2>
          <p className="text-gray-600">Choose agents by country or city for your bulk freight queries</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {selectedAgents.length} Selected
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Agents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Agents</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, company or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleSelectAll}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              {selectedAgents.length === filteredAgents.length ? 'Deselect All' : 'Select All'}
            </Button>
            <span className="text-sm text-gray-600">
              Showing {filteredAgents.length} of {agents.length} agents
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map(agent => (
          <Card
            key={agent.id}
            className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
              selectedAgents.includes(agent.id)
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleAgentToggle(agent.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedAgents.includes(agent.id)}
                    onChange={() => handleAgentToggle(agent.id)}
                  />
                  <div>
                    <CardTitle className="text-lg">{agent.company}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {agent.name}
                    </CardDescription>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {agent.city}, {agent.country}
                    </CardDescription>
                    <CardDescription className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {agent.phone}
                    </CardDescription>
                    <CardDescription className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {agent.email}
                    </CardDescription>
                  </div>
                </div>
                {selectedAgents.includes(agent.id) && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedAgents.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Selection Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-green-800">Total Agents Selected</p>
                <p className="text-2xl font-bold text-green-600">{selectedAgents.length}</p>
              </div>
              <div>
                <p className="font-semibold text-green-800">Coverage Countries</p>
                <p className="text-2xl font-bold text-green-600">
                  {new Set(filteredAgents.filter(a => selectedAgents.includes(a.id)).map(a => a.country)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
