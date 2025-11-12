// netlify/functions/proxy.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Enable CORS
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    const { type, username = 'your-username' } = event.queryStringParameters;
    
    try {
        switch (type) {
            case 'github':
                return await handleGitHubRequest(username);
            case 'projects':
                return await handleProjectsRequest();
            default:
                return { 
                    statusCode: 400, 
                    headers,
                    body: JSON.stringify({ error: 'Invalid request type' }) 
                };
        }
    } catch (error) {
        return { 
            statusCode: 500, 
            headers,
            body: JSON.stringify({ error: error.message }) 
        };
    }
};

async function handleGitHubRequest(username) {
    const API_KEY = process.env.GITHUB_API_KEY;
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: { 
            'Authorization': `token ${API_KEY}`,
            'User-Agent': 'Portfolio-App'
        }
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return { 
        statusCode: 200, 
        headers,
        body: JSON.stringify(data) 
    };
}

async function handleProjectsRequest() {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    // You can replace this with dynamic data from a CMS, JSON file, or GitHub API
    const projects = [
        { 
            name: "Portfolio Website", 
            description: "My personal portfolio built with modern web technologies",
            url: "https://github.com/yourusername/portfolio",
            language: "JavaScript"
        },
        { 
            name: "Project Two", 
            description: "Another amazing project description",
            url: "https://github.com/yourusername/project-two",
            language: "Python"
        }
    ];

    return { 
        statusCode: 200, 
        headers,
        body: JSON.stringify(projects) 
    };
}