import React, { useState, useEffect } from 'react';
import axios from 'axios';




const adjustHeight = (node, parentHeight) => {
    node.height = parentHeight; // Assign the initial height to the parent node

    // Check if the node has children to process
    if (node.children && node.children.length > 0) {
        let totalDistributedHeight = 0; // Track the total height distributed to children

        // First, calculate each child's height based on its ratio
        node.children.forEach(child => {
            const childHeight = Math.max(parentHeight * child.ratio, 100);
            child.height = childHeight;
            totalDistributedHeight += childHeight;
        });

        // If the total distributed height exceeds the parent height due to the minimum height constraint,
        // adjust the heights proportionally to fit within the parent's height
        if (totalDistributedHeight > parentHeight) {
            const scaleFactor = parentHeight / totalDistributedHeight;
            node.children.forEach(child => {
                child.height *= scaleFactor; // Adjust each child's height down proportionally
            });
        }

        // Recursively adjust heights for each child
        node.children.forEach(child => adjustHeight(child, child.height));
    }
};


const fontSizes = [
    { level: 0, statFontSize: '50px', titleFontSize: '30px', percFontSize: '20px'},
    { level: 1, statFontSize: '40px', titleFontSize: '20px', percFontSize: '18px'},
    { level: 2, statFontSize: '30px', titleFontSize: '16px', percFontSize: '14px'},
    { level: 3, statFontSize: '20px', titleFontSize: '14px', percFontSize: '12px'},
    { level: 4, statFontSize: '20px', titleFontSize: '14px', percFontSize: '12px'},
    { level: 5, statFontSize: '20px', titleFontSize: '14px', percFontSize: '12px'},
    //Add more font sizes if needed
  ];

const StatCard = ({ data, borderStyle, level }) => {
    // Calculate font size based on node level
    const fontSizeSettings = fontSizes.find(f => f.level === level) || fontSizes[fontSizes.length - 1];

    const cardContentStyle = {
        display: 'flex',
        flexDirection: data.height <= 100 ? 'row' : 'column',
        justifyContent: 'space-between',
        width: '100%',
    };

    const defaultCardStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: `${data.height}px`,
        width: '300px',
        background: '#FFFFFF',
        boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
        borderRadius: '10px',
        boxSizing: 'border-box',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        position: 'relative',
        zIndex: 2,
        padding: '10px',
        margin: '1px',
        borderLeft: borderStyle,
        transformOrigin: 'left center',
    };

    const statsStyle = {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: fontSizeSettings.statFontSize,
        color: '#333',
    };

    const percentageStyle = {
        marginLeft: '10px',
        fontWeight: 'normal',
        fontSize: fontSizeSettings.percFontSize,
        color: '#1A56DB',
    };

    const titleStyle = {
        alignSelf: data.height <= 100 ? 'center' : 'flex-start',
        fontSize: fontSizeSettings.titleFontSize,
        color: '#333',
        marginTop: data.height <= 100 ? '0' : '5px',
    };

    return (
        <div 
            style={defaultCardStyle} 
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05) translateX(-9%)';
                e.currentTarget.style.boxShadow = '10px 10px 20px #888888';
                e.currentTarget.style.zIndex = 1000;
            }} 
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1) translateX(0)';
                e.currentTarget.style.boxShadow = '5px 5px 15px #aaaaaa';
                e.currentTarget.style.zIndex = 2;
            }}
        >
            <div style={cardContentStyle}>
                <div style={statsStyle}>
                    <span>{`${data.total}`}</span>
                    <span style={percentageStyle}>{`(${(100 * data.ratio).toFixed(1)}%)`}</span>
                </div>
                <div style={titleStyle}>{data.name}</div>
            </div>
        </div>
    );
};









  
const RenderHierarchy = ({ node, isChild = false, level = 0 }) => {
    const nodeId = `node-${node.name.replace(/\s+/g, '-').toLowerCase()}`;
  
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', position: 'relative' }}>
        <StatCard data={node} borderStyle={isChild ? '2px solid blue' : ''} level={level} />
        {node.children && node.children.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
            <style>
              {`.${nodeId}::before {content: ''; position: absolute; top: 50%; left: 10px; width: 60px; border-bottom: 2px solid blue; transform: translateX(-100%); z-index: 0;}`}
            </style>
            {node.children.map((child, index) => (
              <div key={index} className={nodeId} style={{ position: 'relative', marginLeft: '10px' }}>
                <RenderHierarchy node={child} isChild={true} level={level + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  
  
    
  const CallCountDisplay = ({ period }) => {
    const [adjustedData, setAdjustedData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:8000/call/statistics/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            },
            params: {
              period: period,
              type: "ccb"
            }
          });
  
          const {total_calls, answer_type} = response.data;
          const outboundCalls = total_calls;
  
          // create children nodes for each answer type
          const answerTypeChildren = Object.keys(answer_type).map(answerTypeKey => ({
            name: `${answerTypeKey} calls`,
            total: answer_type[answerTypeKey],
            ratio: answer_type[answerTypeKey] / outboundCalls
          }));
  
          const callData = {
            name: 'Total calls',
            total: outboundCalls,
            ratio: 1.00,
            children: [
              {
                name: 'Outbound calls',
                total: outboundCalls,
                ratio: 1.00,
                children: answerTypeChildren
              }
            ]
          };
  
          const dataCopy = JSON.parse(JSON.stringify(callData));
          adjustHeight(dataCopy, 700);
          setAdjustedData(dataCopy);
        } catch (error) {
          console.error('Error fetching statistics:', error);
        }
      };
  
      fetchData();
  
    }, [period]);
  
    if (!adjustedData) return <div>Loading...</div>;
  
    return <RenderHierarchy node={adjustedData} />;
  };
  
  export default CallCountDisplay;