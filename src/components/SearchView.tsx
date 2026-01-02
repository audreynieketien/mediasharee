import { useSearchParams, useNavigate } from 'react-router-dom';
import { Feed } from './Feed';
import { useMemo, useState } from 'react';
import { Input } from './ui/input';
import { Search as SearchIcon } from 'lucide-react';

export function SearchView() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const [localQuery, setLocalQuery] = useState(query);

    // Create filters object for the API
    const filters = useMemo(() => {
        if (!query) return undefined;
        
        return { q: query };
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (localQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Mobile Search Input - Only visible on mobile */}
            <div className="md:hidden px-4">
                <form onSubmit={handleSearch}>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search posts, people, tags..."
                            className="pl-9"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch(e);
                                }
                            }}
                        />
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                 <h3 className="text-xl font-semibold tracking-tight px-4 md:px-0">
                    {query ? `Results for "${query}"` : 'Search'}
                 </h3>
                 
                 {query ? (
                    <Feed filters={filters} />
                 ) : (
                    <div className="text-center py-12 text-muted-foreground px-4">
                        Type in the {window.innerWidth >= 768 ? 'top bar' : 'search box above'} to search for posts, people, or tags.
                    </div>
                 )}
            </div>
        </div>
    );
}
