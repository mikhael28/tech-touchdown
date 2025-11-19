import React, { useState, useMemo } from "react";
import { ExternalLink, Search, Building2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";

// Import all company data
import mediaCompanies from "../data/media-companies.json";
import techCompanies from "../data/tech-companies.json";
import teams from "../data/teams.json";
import operationsCompanies from "../data/operations-companies.json";
import gamblingCompanies from "../data/gambling-companies.json";

interface Company {
  name: string;
  url: string;
  logo?: string;
  type: string;
  description: string;
}

const Companies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Combine all companies
  const allCompanies: Company[] = useMemo(() => {
    return [
      ...mediaCompanies,
      ...techCompanies,
      ...teams,
      ...operationsCompanies,
      ...gamblingCompanies,
    ];
  }, []);

  // Filter companies based on search and type
  const filteredCompanies = useMemo(() => {
    return allCompanies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "all" || company.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [allCompanies, searchQuery, selectedType]);

  // Get company counts by type
  const companyCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allCompanies.length,
      media: mediaCompanies.length,
      tech: techCompanies.length,
      team: teams.length,
      operations: operationsCompanies.length,
      gambling: gamblingCompanies.length,
    };
    return counts;
  }, [allCompanies.length]);

  const typeLabels: Record<string, string> = {
    all: "All Companies",
    media: "Media",
    tech: "Tech",
    team: "Teams",
    operations: "Operations",
    gambling: "Betting & Fantasy",
  };

  const typeColors: Record<string, string> = {
    media: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    tech: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    team: "bg-green-500/10 text-green-500 border-green-500/20",
    operations: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    gambling: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Filters */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search companies by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(typeLabels).map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                className="h-9"
              >
                {typeLabels[type]}
                <Badge
                  variant="secondary"
                  className="ml-2 bg-background/20 border-0"
                >
                  {companyCounts[type]}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="container mx-auto px-4 py-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCompanies.length} of {allCompanies.length} companies
        </p>
      </div>

      {/* Companies grid */}
      <div className="container mx-auto px-4 pb-12">
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No companies found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <Card
                key={`${company.name}-${index}`}
                className="group hover:shadow-lg transition-all duration-200 overflow-hidden border-2 hover:border-primary/50"
              >
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 h-full"
                >
                  {/* Logo and type badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      {company.logo ? (
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden mb-3">
                          <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            className="h-8 w-auto object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                      )}
                    </div>
                    <Badge
                      className={`${
                        typeColors[company.type]
                      } border text-xs font-medium`}
                    >
                      {typeLabels[company.type] || company.type}
                    </Badge>
                  </div>

                  {/* Company name */}
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {company.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {company.description}
                  </p>

                  {/* Link */}
                  <div className="flex items-center text-xs text-primary font-medium mt-auto">
                    <span className="truncate">{company.url}</span>
                    <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
