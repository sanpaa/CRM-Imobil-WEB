/**
 * Supabase Database Client
 * Infrastructure layer - Database connection setup
 * 
 * IMPORTANT: Set environment variables for production:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_KEY: Your Supabase anon key
 */
const { createClient } = require('@supabase/supabase-js');

// Load from environment variables - fallback values are for development only
// In production, these MUST be set as environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Check if credentials are real (not placeholders)
const isPlaceholder = (value) => {
    if (!value) return true;
    const placeholderPatterns = [
        'your-project-id',
        'your-anon-key-here',
        'xxxxx',
        'TODO',
        'REPLACE'
    ];
    return placeholderPatterns.some(pattern => 
        value.toLowerCase().includes(pattern.toLowerCase())
    );
};

const hasValidCredentials = supabaseUrl && supabaseKey && 
                           !isPlaceholder(supabaseUrl) && 
                           !isPlaceholder(supabaseKey);

let supabase = null;

if (hasValidCredentials) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase configured successfully');
} else {
    console.warn('');
    console.warn('⚠️  ═══════════════════════════════════════════════════════════════');
    console.warn('⚠️  SUPABASE NOT CONFIGURED - RUNNING IN OFFLINE MODE');
    console.warn('⚠️  ═══════════════════════════════════════════════════════════════');
    console.warn('⚠️  ');
    console.warn('⚠️  The application is running in READ-ONLY mode with local data.');
    console.warn('⚠️  ');
    console.warn('⚠️  To enable full functionality:');
    console.warn('⚠️  1. Create a .env file: cp .env.example .env');
    console.warn('⚠️  2. Sign up at https://supabase.com');
    console.warn('⚠️  3. Create a new project');
    console.warn('⚠️  4. Get credentials from Settings > API');
    console.warn('⚠️  5. Update .env with SUPABASE_URL and SUPABASE_KEY');
    console.warn('⚠️  6. Create a public bucket named "property-images"');
    console.warn('⚠️  7. Restart the server');
    console.warn('⚠️  ');
    console.warn('⚠️  See QUICKSTART.md for detailed instructions.');
    console.warn('⚠️  ═══════════════════════════════════════════════════════════════');
    console.warn('');
    
    // Create a mock client that always fails gracefully with proper method chaining
    const createMockQueryBuilder = () => {
        const errorResponse = { data: null, error: { message: 'Database not configured' } };
        const builder = {
            select: () => builder,
            insert: () => builder,
            update: () => builder,
            delete: () => builder,
            eq: () => builder,
            single: () => Promise.resolve(errorResponse),
            limit: () => builder,
            order: () => builder,
            then: (resolve) => resolve(errorResponse)
        };
        return builder;
    };
    
    // Create mock storage client
    const createMockStorageBuilder = () => {
        const errorResponse = { data: null, error: { message: 'Storage not configured' } };
        const builder = {
            upload: () => Promise.resolve(errorResponse),
            remove: () => Promise.resolve(errorResponse),
            list: () => Promise.resolve(errorResponse),
            getPublicUrl: () => ({ data: { publicUrl: '' } })
        };
        return builder;
    };
    
    supabase = {
        from: () => createMockQueryBuilder(),
        storage: {
            from: () => createMockStorageBuilder()
        }
    };
}

module.exports = supabase;
