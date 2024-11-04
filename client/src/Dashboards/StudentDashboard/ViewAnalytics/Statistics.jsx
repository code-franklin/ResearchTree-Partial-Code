import React from 'react';
import './Styles/stats.css';

export const Cards = () => {
   

    return (
       <>
        <div className="stats-container">
                

                <div className="box">
                    <div className="card-icon-1 absolute top-0 left-[254px]">
                        <img className="" src="/src/assets/star.png" />
                    </div>
                    <div className="card-content">
                        <p className="card-title">Trending Manuscript</p>
                        <p className="card-value-1 text-white">Machine Learning</p>
                    </div>
                </div>
                <div className="box">
                    <div className="card-icon-2 left-[600px]">
                        <img className="" src="/src/assets/Check.png" />
                    </div>
                    <div className="card-content">
                        <p className="card-title">Total Manuscript</p>
                        <p className="card-value-2 text-white">2,504</p>
                    </div>
                </div>
                <div className="box">
                    <div className="card-icon-3 left-[938px]">
                        <img className="" src="/src/assets/Trophy.png" />
                    </div>
                    <div className="card-content">
                        <p className="card-title">Best Thesis</p>
                        <p className="card-value-3 text-white">300</p>
                    </div>
                </div>
            </div>
            
       </>
           
    );
};

export default Cards;