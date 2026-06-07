
import Navbar from "../components/navbar/Navbar";
import styles from "./layout.module.css"

interface LayoutProps {
    children:React.ReactNode
}

const Layout = ({children}:LayoutProps)=> {
    return <div className={styles.layout}>
        <Navbar/>
        {children}
    </div>
}

export default Layout;