import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Post {
  id: string;
  title: string;
  description: string;
  country?: string;
  city?: string;
  server?: string;
  thumbnail?: string;
  createdAt: string;
}

interface PostsResponse {
  posts: Post[];
  total: number;
}

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala",
  "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
].sort();

const CITIES_BY_COUNTRY: Record<string, string[]> = {
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Newcastle", "Sheffield", "Bristol", "Edinburgh"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Mississauga", "Winnipeg", "Quebec City", "Hamilton"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Logan City", "Parramatta"],
  "Germany": ["Berlin", "Munich", "Frankfurt", "Cologne", "Hamburg", "Dusseldorf", "Dortmund", "Essen", "Leipzig", "Dresden"],
  "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille"],
  "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"],
  "Japan": ["Tokyo", "Yokohama", "Osaka", "Kobe", "Kyoto", "Kawasaki", "Saitama", "Hiroshima", "Fukuoka", "Nagoya"],
  "Brazil": ["Sao Paulo", "Rio de Janeiro", "Brasilia", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre"],
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedServer, setSelectedServer] = useState("");
  const [servers, setServers] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [postsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [serverSearch, setServerSearch] = useState("");

  const availableCities = selectedCountry
    ? (CITIES_BY_COUNTRY[selectedCountry] || []).filter(city =>
        city.toLowerCase().includes(citySearch.toLowerCase())
      )
    : [];

  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredServers = servers.filter(server =>
    server.toLowerCase().includes(serverSearch.toLowerCase())
  );

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data: PostsResponse = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };

    const loadServers = async () => {
      try {
        const response = await fetch("/api/servers");
        const data = await response.json();
        setServers(data.servers || []);
      } catch (error) {
        console.error("Error loading servers:", error);
      }
    };

    loadPosts();
    loadServers();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter(post => post.country === selectedCountry);
    }

    if (selectedCity) {
      filtered = filtered.filter(post => post.city === selectedCity);
    }

    if (selectedServer) {
      filtered = filtered.filter(post => post.server === selectedServer);
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [posts, searchQuery, selectedCountry, selectedCity, selectedServer]);

  useEffect(() => {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    setDisplayedPosts(filteredPosts.slice(start, end));
  }, [filteredPosts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-background via-card to-background pt-16 pb-12 md:pt-24 md:pb-20 border-b border-border/50">
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-6xl md:text-7xl font-black mb-3 text-foreground tracking-tighter leading-none">
              Doxing Dot Life
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl">
              Find if you or someone you know have been Doxed
            </p>

            {/* Search Bar */}
            <div className="relative mb-12">
              <input
                type="text"
                placeholder="Search for doxed individuals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-card border-2 border-border hover:border-accent/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-lg transition-colors"
              />
              <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            </div>

            {/* Categories Section */}
            <div className="mb-0">
              <h3 className="text-xs font-bold text-muted-foreground mb-5 uppercase tracking-widest">
                📂 Look into Categories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Country Dropdown */}
                <div className="relative group">
                  <label className="text-xs font-semibold text-muted-foreground block mb-2">
                    By Country
                  </label>
                  <input
                    type="text"
                    placeholder={selectedCountry ? selectedCountry : "Select country..."}
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border hover:border-accent/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm transition-colors"
                  />
                  {countrySearch && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg z-50 max-h-48 overflow-y-auto shadow-lg">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <button
                            key={country}
                            onClick={() => {
                              setSelectedCountry(country);
                              setCountrySearch("");
                              setSelectedCity("");
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-accent/20 text-foreground text-sm transition-colors"
                          >
                            {country}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-muted-foreground text-sm">No countries found</div>
                      )}
                    </div>
                  )}
                  {selectedCountry && (
                    <button
                      onClick={() => {
                        setSelectedCountry("");
                        setSelectedCity("");
                        setCountrySearch("");
                      }}
                      className="absolute top-3 right-3 text-accent hover:text-accent/80 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* City Dropdown */}
                {selectedCountry && (
                  <div className="relative group">
                    <label className="text-xs font-semibold text-muted-foreground block mb-2">
                      By City
                    </label>
                    <input
                      type="text"
                      placeholder={selectedCity ? selectedCity : "Select city..."}
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border hover:border-accent/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm transition-colors"
                    />
                    {citySearch && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg z-50 max-h-48 overflow-y-auto shadow-lg">
                        {availableCities.length > 0 ? (
                          availableCities.map((city) => (
                            <button
                              key={city}
                              onClick={() => {
                                setSelectedCity(city);
                                setCitySearch("");
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-accent/20 text-foreground text-sm transition-colors"
                            >
                              {city}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-muted-foreground text-sm">No cities found</div>
                        )}
                      </div>
                    )}
                    {selectedCity && (
                      <button
                        onClick={() => {
                          setSelectedCity("");
                          setCitySearch("");
                        }}
                        className="absolute top-3 right-3 text-accent hover:text-accent/80 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}

                {/* Server Dropdown */}
                {servers.length > 0 && (
                  <div className="relative group">
                    <label className="text-xs font-semibold text-muted-foreground block mb-2">
                      By Server
                    </label>
                    <input
                      type="text"
                      placeholder={selectedServer ? selectedServer : "Select server..."}
                      value={serverSearch}
                      onChange={(e) => setServerSearch(e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border hover:border-accent/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm transition-colors"
                    />
                    {serverSearch && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg z-50 max-h-48 overflow-y-auto shadow-lg">
                        {filteredServers.length > 0 ? (
                          filteredServers.map((server) => (
                            <button
                              key={server}
                              onClick={() => {
                                setSelectedServer(server);
                                setServerSearch("");
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-accent/20 text-foreground text-sm transition-colors"
                            >
                              {server}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-muted-foreground text-sm">No servers found</div>
                        )}
                      </div>
                    )}
                    {selectedServer && (
                      <button
                        onClick={() => {
                          setSelectedServer("");
                          setServerSearch("");
                        }}
                        className="absolute top-3 right-3 text-accent hover:text-accent/80 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hot & Recent Posts */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl md:text-4xl font-black mb-8">
            {filteredPosts.length === 0 ? "No Posts Found" : "Hot & Recent Posts"}
          </h2>

          {displayedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {displayedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors duration-300 cursor-pointer"
                  >
                    {post.thumbnail && (
                      <div className="w-full h-40 bg-muted overflow-hidden">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-foreground text-lg line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {post.country && (
                          <span className="bg-accent bg-opacity-20 text-accent px-2 py-1 rounded">
                            {post.country}
                          </span>
                        )}
                        {post.city && (
                          <span className="bg-accent bg-opacity-20 text-accent px-2 py-1 rounded">
                            {post.city}
                          </span>
                        )}
                        {post.server && (
                          <span className="bg-accent bg-opacity-20 text-accent px-2 py-1 rounded">
                            {post.server}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          "px-3 py-2 rounded-lg transition-colors",
                          currentPage === page
                            ? "bg-accent text-accent-foreground"
                            : "bg-card border border-border hover:border-accent"
                        )}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No posts match your search criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
