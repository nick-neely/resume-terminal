import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #18181B, #27272A)', // Zinc-900 to Zinc-800
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(39, 39, 42, 0.8)', // Zinc-800 with some transparency
            borderRadius: '12px',
            border: '1px solid #3F3F46', // Zinc-700
            overflow: 'hidden',
          }}
        >
          {/* Terminal Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: 'rgba(24, 24, 27, 0.8)', // Zinc-900 with some transparency
              borderBottom: '1px solid #3F3F46', // Zinc-700
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
              }}
            />
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#EAB308',
              }}
            />
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#22C55E',
              }}
            />
          </div>

          {/* Terminal Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '40px',
              gap: '20px',
            }}
          >
            {/* ASCII Art Title */}
            <div
              style={{
                color: '#E4E4E7', // Zinc-200
                fontSize: '32px',
                whiteSpace: 'pre',
                fontFamily: 'monospace',
                marginBottom: '20px',
              }}
            >
              {'RESUMETERMINAL'}
            </div>

            {/* Welcome Text */}
            <div
              style={{
                color: '#A1A1AA', // Zinc-400
                fontSize: '24px',
                fontFamily: 'monospace',
              }}
            >
              {'Welcome to ResumeTerminal - Your interactive resume experience!'}
            </div>

            {/* Command Prompt */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#A1A1AA', // Zinc-400
                fontSize: '20px',
                fontFamily: 'monospace',
              }}
            >
              <span style={{ color: '#22C55E' }}>{'$'}</span>
              <span>{"Type 'help' to get started..."}</span>
              <span
                style={{
                  width: '8px',
                  height: '24px',
                  backgroundColor: '#E4E4E7', // Zinc-200
                  animation: 'blink 1s infinite',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
