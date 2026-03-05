import JobList from "@/app/common-components/JobList"
import SearchBar from "@/app/common-components/SearchBar"


export default function Admin(){
    return (
        <div>
            <SearchBar/>
            <JobList/>
            <button>Add Job</button>
        </div>
    )
}