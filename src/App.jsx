import React, { useState, useEffect } from 'react';
import './App.css';

function SearchForm() {
    const [entity1Name, setEntity1Name] = useState('');
    const [entity2Name, setEntity2Name] = useState('');
    const [separateQuery, setSeparateQuery] = useState(false);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('Loading:', loading);
        console.log('Error:', error);
    }, [loading, error]);

    const handleSearch = async () => {
        if (!entity1Name) {
            setError('请输入至少一个实体名称');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entity1Name, entity2Name, separateQuery })
            });

            if (!response.ok) {
                throw new Error(`Search request failed with status: ${response.status}`);
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(`请求错误: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-form"> {/* 应用 .search-form 类到表单容器 */}
            <input
                type="text"
                value={entity1Name}
                onChange={(e) => setEntity1Name(e.target.value)}
                placeholder="输入第一个实体名称"
            />
            <input
                type="text"
                value={entity2Name}
                onChange={(e) => setEntity2Name(e.target.value)}
                placeholder="输入第二个实体名称（可选）"
            />
            <label>
                分别查询：
                <input
                    type="checkbox"
                    checked={separateQuery}
                    onChange={(e) => setSeparateQuery(e.target.checked)}
                />
            </label>
            <button onClick={handleSearch} disabled={loading}>
                {loading ? '搜索中...' : '搜索'}
            </button>

            {error && <div className="error-message">{error}</div>} {/* 单独的样式类用于错误消息 */}
            {results.length > 0 && (
                <ul>
                    {results.map((docId, index) => (
                        <li key={index}>文档 ID: {docId}</li> // 假设结果是文档ID
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchForm;
