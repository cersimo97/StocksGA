import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'
import PST from './data/PST.json'
import worker from 'workerize-loader!./gaWebWorker' // eslint-disable-line import/no-webpack-loader-syntax

const instance = worker()

function App() {
  const [data, setData] = useState()
  const [best, setBest] = useState()
  const [res, setRes] = useState()
  const [isRunning, setIsRunning] = useState(false)
  const [hoverDot, setHoverDot] = useState()

  useEffect(() => {
    if (!data) {
      const newPST = reverse(PST).map(m => ({
        x: m.Data,
        y: parseFloat(m.Ultimo.replace(',', '.')),
      }))
      setData(newPST)
    }
  }, [data])

  useEffect(() => {
    if (isRunning && best) {
      setIsRunning(false)
    }
  }, [best, isRunning])

  const startGA = async () => {
    console.log('startGA')
    console.log('starting...')
    setIsRunning(true)
    setBest(null)
    setRes(null)
    setHoverDot(null)
    const { best, data: d } = await instance.start({
      data,
    })
    if (best) {
      console.log(best)
      setBest(best)
      setRes(d)
      setIsRunning(false)
    }
  }

  const CustomizedDot = props => {
    const { cx, cy, payload } = props

    const handleMouseEnter = () => {
      setHoverDot(payload)
    }

    const handleMouseLeave = () => {
      setHoverDot(null)
    }

    if (payload.action === 'i') return null

    return (
      <svg
        key={payload.instance.x}
        x={cx - 10}
        y={cy - 10}
        width={20}
        height={20}
        fill={payload.action === 'b' ? 'green' : 'red'}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <circle cx={10} cy={10} r={5} />
      </svg>
    )
  }

  const handleMouseEnter = payload => {
    console.log(payload)
  }

  const handleMouseLeave = payload => {
    console.log(payload)
  }

  return (
    <Container>
      <Box my={4}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: 0.5 }}
        >
          PST
        </Typography>
        {data ? (
          <>
            <ResponsiveContainer height={400} width="100%">
              <LineChart data={best ? best.genes : data}>
                <Line
                  dataKey={best ? 'instance.y' : 'y'}
                  type="monotone"
                  stroke="#486486"
                  dot={
                    best
                      ? props => (
                          <CustomizedDot
                            {...props}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          />
                        )
                      : false
                  }
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <Box sx={{ height: '20px' }}>
              <Typography variant="caption" component="p">
                {hoverDot && (
                  <>
                    <span
                      style={{
                        background: hoverDot.action === 'b' ? 'green' : 'red',
                        color: hoverDot.action === 'b' ? 'white' : 'black',
                        padding: '2px 4px',
                        fontWeight: 700,
                        borderRadius: '5px',
                      }}
                    >
                      {hoverDot.action === 'b' ? 'BUY' : 'SELL'}
                    </span>{' '}
                    <span>
                      {hoverDot.instance.x} - {hoverDot.instance.y}
                    </span>
                  </>
                )}
              </Typography>
            </Box>
          </>
        ) : (
          'Caricamento in corso'
        )}
      </Box>
      <Stack spacing={2} justifyContent="center" alignItems="center">
        <LoadingButton
          disabled={isRunning || !instance}
          color="primary"
          startIcon={<SettingsSuggestIcon />}
          sx={{ height: '4rem' }}
          onClick={startGA}
          loading={isRunning}
          variant="contained"
        >
          Avvia GA
        </LoadingButton>
        {best && (
          <Typography variant="body2" color="text.secondary">
            {new Intl.NumberFormat('it-IT', {
              style: 'currency',
              currency: 'EUR',
            }).format(best?.earnings)}
          </Typography>
        )}
        {res && (
          <ResponsiveContainer height={150} width="85%">
            <LineChart data={res?.fitnessHistory}>
              <Line
                dataKey="fitness"
                type="monotone"
                stroke="#41236b"
                dot={false}
                isAnimationActive={false}
              />
              <Line
                dataKey="bestFitness"
                type="monotone"
                stroke="#319124"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Stack>
    </Container>
  )
}

export default App

function reverse(arr) {
  return arr.length === 0 ? [] : [arr.pop()].concat(reverse(arr))
}
