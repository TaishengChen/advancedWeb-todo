import React from 'react';

function Row({ item, deleteTask }) {
    console.log(item, deleteTask);
    return (
        <li key={item.id}>{item.description}
            <button className='delete-button' onClick={() => deleteTask(item.id)}>Delete</button>
        </li>
    );
}

export default Row;