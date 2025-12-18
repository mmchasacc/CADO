import axios from "axios"
import { useEffect, useState } from "react"
import type { User } from "../Types"


const Users = () => {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        let isMounted = true

        const controller = new AbortController()

        const getUsers = async () => {
    
            try {
    
                const response = await axios.get("/Users", {
                    signal: controller.signal
                })
                console.log(response.data)
                if (isMounted) {
                    setUsers(response.data)
                }
            }   catch(err) {
                console.error(err)
            }
        }

        getUsers()

        return () => {
            isMounted = false
            controller.abort()
        }
        }, [])


    return (
        <article>
            <h2>Users List</h2>
            {users?.length
            ? (
                <ul>
                    {users.map((user, i) => <li key={i}>{user?.username}</li>)}
                </ul>
            ) : <p>No users to display</p>}
        </article>
    )

}

export default Users