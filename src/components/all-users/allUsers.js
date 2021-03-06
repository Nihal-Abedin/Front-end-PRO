import React, { useEffect, useState, useContext } from "react";
import { Configuration } from "../../configuration/configuration";

import { UserContext } from "../../store/user-context";

import { Error_Toast, Success_Toast } from "../ui/toast/toast";
import { View } from "../../icons/icons";
import Button from "../ui/formButton";
import Users from "./users/users";
import Loading from "../ui/loading"

import styles from "./allUsers.module.css";



const TableBody = props => {
    console.log(props.user, "ALL USERS")
    const limtUser = props.user.slice(props.start, props.end);
    const handle = () => {

        props.onShowDetails();
    }
    return <tbody>
        {limtUser?.map(user => {
            return <tr key={user?.username}>
                <td>{user?.userId}</td>
                <td>{user?.mobile}</td>
                <td>{user?.username}</td>
                <td>{user?.userType}</td>
                <td>{user?.university}</td>
                <td onClick={handle}><a href={`#${user?.userId}`}>{View}</a></td>

            </tr>
        })}

    </tbody>
}
const AllUsers = props => {
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState("desc");
    const [query, setQuery] = useState("north");
    const LogCtx = useContext(UserContext);

    useEffect(() => {
       const timer = setTimeout(()=> { const getUsers = async () => {
        try {

            const sendReq = fetch(`https://exam.greeho.com/api/users?query=${query}&offset=${Configuration.OFFSET - page}&currentPage=${page}&sortBy=userId&orderBy=${order}`, {
                method: "GET",
                headers: {
                    'x-api-key': Configuration.X_API_KEY,
                }
            });
            const promise = await sendReq;
            if (!promise.ok) {
                setIsLoading(false)
                const res = await promise.json();
                console.log(res);
                if (res.status === 401) {
                    LogCtx.setIsLoggedIn();
                    LogCtx.setUser();
                    LogCtx.setShowProfile(false);
                }
                if(res.status === 500) {
                    getUsers();
                }
                Error_Toast(res.message);

            }
            const res = await promise.json();
            Success_Toast(res.message);
            setUsers(res.data.users);
            setIsLoading(false)

        } catch (err) {

        }
    };
    getUsers();
}, 300)

    return () => {
     clearTimeout(timer);   
    }
    }, [query]);

    const numberOfPages = Math.ceil(users.length / 10);
    console.log(numberOfPages, "PAGES");

    const handlePageNext = () => {
        setPage(prev => {
            return prev + 1;
        })
    }
    const handlePagePrevious = () => {
        setPage(prev => {
            return prev - 1;
        })
    }
    const showDeatils = () => {
        setShowUserModal(!showUserModal);
    }
    const handelQuery = e => {
        setQuery(e.target.value)
    }
    const handelOreder = () => {
        setOrder( "asc")
    }
    return <>
        {showUserModal && <Users onClose={showDeatils} />}

        <div className={styles.select}>
        <p>Search by Query :</p>
        {/* <select onChange={handelQuery}>
            <option selected value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
        </select> */}
        <input type="text" onChange={handelQuery}/>
        <p onClick={handelOreder}>Order By</p>
        </div>
        {isLoading && <Loading />}
        {!isLoading && <div> <table className={styles.contentTable}>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Number</th>
                    <th>Name</th>
                    <th>User Type</th>
                    <th>University</th>
                    <th></th>
                </tr>
            </thead>
            <TableBody onShowDetails={showDeatils} user={users} start={(page - 1) * 10} end={page * 10} />
        </table>
            <div className={styles.paginationButtons}>
                {page === 1 && numberOfPages > 1 && <Button onClick={handlePageNext}>Next {page + 1}</Button>}
                {page < numberOfPages && page !== 1 && <div><Button onClick={handlePagePrevious}>Previous {page - 1}</Button> <Button onClick={handlePageNext}>Next {page + 1}</Button></div>}
                {page === numberOfPages && numberOfPages > 1 && <Button onClick={handlePagePrevious}>Previous {page - 1}</Button>}
            </div>
        </div>}



    </>
};

export default AllUsers;