import JobList from "@/app/common-components/JobList";
import SearchBar from "@/app/common-components/SearchBar";

export default function Jobs(){
    return (
        <div>
            <SearchBar/>
            <JobList/>
        </div>
    )
}