import { useRouter } from 'next/router'

const Redirect = ({route}) => {
    const router = useRouter()
    router.push(route)
    return null
}
 
export default Redirect;