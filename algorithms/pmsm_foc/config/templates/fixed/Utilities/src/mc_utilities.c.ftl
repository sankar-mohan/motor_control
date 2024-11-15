/*******************************************************************************
  Utility Functions

  Company:
    - Microchip Technology Inc

  File Name:
    - mc_utilitiesc

  Summary:
    - Utility Functions

  Description:
    - Utility Functions

 *******************************************************************************/

// DOM-IGNORE-BEGIN
/*******************************************************************************
 * Copyright (C) 2022 Microchip Technology Inc and its subsidiaries
 *
 * Subject to your compliance with these terms, you may use Microchip software
 * and any derivatives exclusively with Microchip products. It is your
 * responsibility to comply with third party license terms applicable to your
 * use of third party software (including open source software) that may
 * accompany Microchip software.
 *
 * THIS SOFTWARE IS SUPPLIED BY MICROCHIP "AS IS" NO WARRANTIES, WHETHER
 * EXPRESS, IMPLIED OR STATUTORY, APPLY TO THIS SOFTWARE, INCLUDING ANY IMPLIED
 * WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY, AND FITNESS FOR A
 * PARTICULAR PURPOSE.
 *
 * IN NO EVENT WILL MICROCHIP BE LIABLE FOR ANY INDIRECT, SPECIAL, PUNITIVE,
 * INCIDENTAL OR CONSEQUENTIAL LOSS, DAMAGE, COST OR EXPENSE OF ANY KIND
 * WHATSOEVER RELATED TO THE SOFTWARE, HOWEVER CAUSED, EVEN IF MICROCHIP HAS
 * BEEN ADVISED OF THE POSSIBILITY OR THE DAMAGES ARE FORESEEABLE TO THE
 * FULLEST EXTENT ALLOWED BY LAW, MICROCHIP'S TOTAL LIABILITY ON ALL CLAIMS IN
 * ANY WAY RELATED TO THIS SOFTWARE WILL NOT EXCEED THE AMOUNT OF FEES, IF ANY,
 * THAT YOU HAVE PAID DIRECTLY TO MICROCHIP FOR THIS SOFTWARE.
 *******************************************************************************/
// DOM-IGNORE-END


/*******************************************************************************
Headers inclusions
 *******************************************************************************/

#include <math.h>
#include "definitions.h"
#include "mc_utilities.h"

/*******************************************************************************
Macro definitions
 *******************************************************************************/
#define    RL_500MS_10MS        200u

/**
 *  Trignometric tables dimension shift value
 */
#define  SH_TRIG_TABLE_DIMENSION    ( 8u )

/**
 *  Trignometric tables dimension
 */
#define  TRIG_TABLE_DIMENSION       ( (uint16_t)1u << (uint16_t)SH_TRIG_TABLE_DIMENSION )

/**
 *  Sine table shift value
 */
#define  SH_SINE_TABLE      ( 14u - SH_TRIG_TABLE_DIMENSION )

/**
 *  Sine table shift value
 */
#define  GET_FIRST_QUADRANT(x)     ( (x) & 0x3FFFu )

/**
 *  Sine table shift value
 */
#define   IS_NEGATIVE(x)  ( (x) & 0x8000u )

/**
 *  Sine table shift value
 */
#define   IS_COSINE(x)      ( (x) & 0x4000u )

/******************************************************************************
Private global variables
******************************************************************************/
/**
 * Sine data in 16 bit format
 *      0 - 256 maps to 0 to Pi/2
 */

static const int16_t sineTable[ TRIG_TABLE_DIMENSION + 1u ] =
{
        0,   202,   402,   604,   804,  1006,  1206,  1408,  //   0, ..,   7
    1608,  1808,  2010,  2210,  2410,  2612,  2812,  3012,  //   8, ..,  15
    3212,  3412,  3612,  3812,  4012,  4210,  4410,  4610,  //  16, ..,  23
    4808,  5006,  5206,  5404,  5602,  5800,  5998,  6196,  //  24, ..,  31
    6392,  6590,  6786,  6984,  7180,  7376,  7572,  7766,  //  32, ..,  39
    7962,  8156,  8352,  8546,  8740,  8934,  9126,  9320,  //  40, ..,  47
    9512,  9704,  9896, 10088, 10278, 10470, 10660, 10850,  //  48, ..,  55
   11040, 11228, 11416, 11606, 11794, 11980, 12168, 12354,  //  56, ..,  63
   12540, 12726, 12910, 13094, 13278, 13462, 13646, 13828,  //  64, ..,  71
   14010, 14192, 14372, 14552, 14732, 14912, 15090, 15270,  //  72, ..,  79
   15446, 15624, 15800, 15976, 16152, 16326, 16500, 16674,  //  80, ..,  87
   16846, 17018, 17190, 17360, 17530, 17700, 17870, 18038,  //  88, ..,  95
   18204, 18372, 18538, 18704, 18868, 19032, 19196, 19358,  //  96, .., 103
   19520, 19682, 19842, 20002, 20160, 20318, 20476, 20632,  // 104, .., 111
   20788, 20942, 21098, 21250, 21404, 21556, 21706, 21856,  // 112, .., 119
   22006, 22154, 22302, 22448, 22594, 22740, 22884, 23028,  // 120, .., 127
   23170, 23312, 23454, 23594, 23732, 23870, 24008, 24144,  // 128, .., 135
   24280, 24414, 24548, 24680, 24812, 24944, 25074, 25202,  // 136, .., 143
   25330, 25458, 25584, 25708, 25832, 25956, 26078, 26200,  // 144, .., 151
   26320, 26438, 26558, 26674, 26790, 26906, 27020, 27134,  // 152, .., 159
   27246, 27356, 27466, 27576, 27684, 27792, 27898, 28002,  // 160, .., 167
   28106, 28208, 28310, 28412, 28512, 28610, 28708, 28804,  // 168, .., 175
   28900, 28994, 29086, 29178, 29270, 29360, 29448, 29536,  // 176, .., 183
   29622, 29708, 29792, 29874, 29956, 30038, 30118, 30196,  // 184, .., 191
   30274, 30350, 30426, 30500, 30572, 30644, 30714, 30784,  // 192, .., 199
   30852, 30920, 30986, 31050, 31114, 31176, 31238, 31298,  // 200, .., 207
   31358, 31414, 31472, 31526, 31582, 31634, 31686, 31736,  // 208, .., 215
   31786, 31834, 31882, 31928, 31972, 32016, 32058, 32098,  // 216, .., 223
   32138, 32176, 32214, 32250, 32286, 32320, 32352, 32384,  // 224, .., 231
   32414, 32442, 32470, 32496, 32522, 32546, 32568, 32590,  // 232, .., 239
   32610, 32630, 32648, 32664, 32680, 32694, 32706, 32718,  // 240, .., 247
   32728, 32738, 32746, 32752, 32758, 32762, 32766, 32767,  // 248, .., 255
   32767
};

/*******************************************************************************
 *  Functions
 *******************************************************************************/

/*! \brief Calculate sine and cosine value
 *
 * Details
 * Calculate sine value
 *
 * @param[in]:
 * @param[in/out]:
 * @param[out]:
 * @return:
 */

#ifdef RAM_EXECUTE
void __ramfunc__ mcUtils_SineCosineCalculation( const uint16_t ang,
                                                                  int16_t * const sine,  int16_t * const cosine )
#else
void mcUtils_SineCosineCalculation(const uint16_t ang,
                                   int16_t * const sine,  int16_t * const cosine )
#endif
{
     uint16_t  a;
     uint16_t angle;

     /** Remap the input angle to first quadrant */
     angle = ang;
     a = GET_FIRST_QUADRANT( angle);

     /** Subtract the angle from 2Pi if it is in 2nd quadrant */
     if( 0u != IS_COSINE(angle))
     {
         a = Q15_ANGLE( HALF_PI  ) - a;
     }

     /** Set the sign of the sine value  */
     *sine =  ( 0u != IS_NEGATIVE(angle))? -sineTable[a >> SH_SINE_TABLE]: sineTable[a >> SH_SINE_TABLE];

     /** Remap the input angle to first quadrant */
     angle = ang + Q15_ANGLE( HALF_PI  );
     a = GET_FIRST_QUADRANT( angle );

     /** Subtract the angle from 2Pi if it is in 2nd quadrant */
     if( 0u != IS_COSINE(angle))
     {
          a = Q15_ANGLE( HALF_PI  ) - a;
     }

     /** Set the sign of the sine value  */
     *cosine = ( 0u != IS_NEGATIVE(angle))? -sineTable[a >> SH_SINE_TABLE]: sineTable[a >> SH_SINE_TABLE];
}


/*! \brief Calculate square root value
 *
 * Details
 * Calculate square root value
 *
 * @param[in]:
 * @param[in/out]:
 * @param[out]:
 * @return:
 */
#ifdef RAM_EXECUTE
uint32_t  __ramfunc__ mcUtils_SquareRoot(uint32_t number)
#else
uint32_t mcUtils_SquareRoot(uint32_t number )
#endif
{
    return DIVAS_SquareRoot( number );
}

/*! \brief Linear ramp
 *
 * Details
 * Linear ramp
 *
 * @param[in]:
 * @param[in/out]:
 * @param[out]:
 * @return:
 */
#ifdef RAM_EXECUTE
 void __ramfunc__ mcUtils_LinearRamp(int32_t * const input, const int32_t stepSize, const int32_t finalValue)
#else
void mcUtils_LinearRamp(int32_t * const input, const int32_t stepSize, const int32_t finalValue)
#endif
{
    if ((*input + stepSize) < finalValue)
    {
        *input = *input + stepSize;
    }
    else if ((*input - stepSize) > finalValue)
    {
        *input = *input - stepSize;
    }
    else
    {
        *input = finalValue;
    }
}

/*! \brief Button response Function
 *
 * Details
 * Button response function
 *
 * @param[in]:
 * @param[in/out]:
 * @param[out]:
 * @return:
 */
void mcUtils_ButtonResponse(button_response_t * buttonResData, void (* buttonJob)(void))
{
    switch (buttonResData->state)
    {
        case 0u: /** Detect if button is pressed */
        {
            if (false == buttonResData->inputVal )
            {
                buttonJob();
                buttonResData->cnt = 0u;
                buttonResData->state = 1u;
            }
            break;
        }
        case 1u: /** Stay idle for 500ms, and then return to detect */
        {
            buttonResData->cnt++;
            if (buttonResData->cnt >= RL_500MS_10MS)
            {
                buttonResData->cnt = 0u;
                buttonResData->state = 0u;
            }
            break;
        }
        default:
        {
            /** For MISRA Compliance */
        }
        break;
    }
}


/*! \brief
 *
 * Details
 *
 *
 * @param[in]:
 * @param[in/out]:
 * @param[out]:
 * @return:
 */
void mcUtils_FloatToValueShiftPair( const float32_t input, int16_t * const value, uint16_t * const shift )
{
#if defined ENABLE_FLOAT_IN_WHILE
    float32_t f32a;

   /* MISRA C-2012 Rule 14.1 deviated:2 Deviation record ID -  H3_MISRAC_2012_R_14_1_DR_1 */
    #pragma GCC diagnostic push
    #pragma GCC diagnostic ignored "-Wunknown-pragmas"
    #pragma coverity compliance block deviate:2 "MISRA C-2012 Rule 14.1" "H3_MISRAC_2012_R_14_1_DR_1"
    f32a = input;
    *shift = 0u;
    if( f32a > 0.0f ) {
        while(( ( f32a * 2.0f )  < 32767.0f ) && ( 15u > *shift ) )
        {
            f32a *= 2.0f;
            (*shift )++;
        }

        f32a += 0.5f;
        *value = ( int16_t)f32a;
    }
    else
    {
        while(( ( f32a * 2.0f )  > -32767.0f ) && ( 15u > *shift ) )
        {
            f32a *= 2.0f;
            (*shift )++;
        }

        f32a += 0.5f;
        *value = ( int16_t)f32a;
    }
    #pragma coverity compliance end_block "MISRA C-2012 Rule 14.1"
    #pragma GCC diagnostic pop
    /* MISRAC 2012 deviation block end */

#else
     uint16_t u16a;
     float32_t f32a;

     u16a = 15u - (uint16_t)log2(input);
     *shift = u16a;

     u16a = (uint16_t)1 << u16a;
     f32a = (input * (float32_t)u16a) + 0.5f;
    *value = (int16_t)f32a;
#endif
}
