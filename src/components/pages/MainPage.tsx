import './MainPage.css'
import {Header} from "@/components/ui/complex/header.tsx";
import {CourseGallery} from "@/components/ui/complex/courseGallery.tsx";

function MainPage() {
    return (
        <div>
            <Header/>
            <div className="py-43">
                <CourseGallery/>
            </div>
        </div>
    )
}

export default MainPage
