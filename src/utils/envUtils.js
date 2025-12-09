/**
 * Environment Utilities
 * Helper functions for environment variable validation
 */

/**
 * Check if a value is a placeholder (not real credentials)
 * @param {string} value - The value to check
 * @returns {boolean} - True if the value appears to be a placeholder
 */
function isPlaceholder(value) {
    if (!value) return true;
    
    // Pre-defined lowercase placeholder patterns
    const placeholderPatterns = [
        'your-project-id',
        'your-anon-key-here',
        'xxxxx',
        'todo',
        'replace'
    ];
    
    const valueLower = value.toLowerCase();
    return placeholderPatterns.some(pattern => valueLower.includes(pattern));
}

/**
 * Check if Supabase credentials are valid (not placeholders)
 * @param {string} url - Supabase URL
 * @param {string} key - Supabase key
 * @returns {boolean} - True if credentials are valid
 */
function hasValidSupabaseCredentials(url, key) {
    return url && key && !isPlaceholder(url) && !isPlaceholder(key);
}

module.exports = {
    isPlaceholder,
    hasValidSupabaseCredentials
};
