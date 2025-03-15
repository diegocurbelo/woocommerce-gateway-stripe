import React, { useEffect } from 'react';

const CheckoutSession = ( {
	eventRegistration: { onPaymentSetup },
	paymentMethodId,
	upeMethods,
	api,
	...props
} ) => {
	// console.log( { props } );
	const {
		activePaymentMethod,
		billing: { billingAddress },
	} = props;
	// const { billingAddress } = props.billing;
	useEffect( () => {
		const urlParams = new URLSearchParams( window.location.search );
		const checkoutSessionId = urlParams.get( 'checkout_session_id' );
		if ( checkoutSessionId ) {
			console.log( 'Checkout Session ID:', checkoutSessionId );
			// cs_test_c1HLLF6lgNl8BrC7dJ9lZ33Qlwqt6H8e5CMbGV2ynxOtLRkOYMc4z4YcXX
			// Puedes realizar alguna acción con checkoutSessionId si es necesario
			// lo mas probable es que tengamos que hacer un nuevo query para obtener el payment method ID segun el checkout session id
		}
	}, [] );

	useEffect( () => {
		console.log( { upeMethods } );
		console.log( { paymentMethodId } );
		const unsubscribe = onPaymentSetup( () => {
			console.log( 'onPaymentSetup' );
			console.log( { activePaymentMethod } );
			if ( upeMethods[ paymentMethodId ] !== activePaymentMethod ) {
				return;
			}

			const setup = {
				type: 'success',
				meta: {
					paymentMethodData: {
						payment_method: upeMethods[ paymentMethodId ],
						wc_payment_intent_id: '',
						'wc-stripe-is-deferred-intent': true,
						'wc-stripe-payment-method':
							'pm_1R47ZWADnlvD6DMtK6Jd1odG',
						save_payment_method: 'no',
						// The billing information here is relevant to properly create the Stripe Customer object.
						billing_email: billingAddress.email,
						billing_first_name: billingAddress.first_name,
						billing_last_name: billingAddress.last_name,
						billing_address_1: billingAddress.address_1,
						billing_address_2: billingAddress.address_2,
						billing_city: billingAddress.city,
						billing_state: billingAddress.state,
						billing_postcode: billingAddress.postcode,
						billing_country: billingAddress.country,
					},
				},
			};
			console.log( { setup } );
			return setup;
		} );
		return unsubscribe;
	}, [ upeMethods, paymentMethodId, onPaymentSetup ] );

	const createCheckoutSession = async ( e ) => {
		e.preventDefault();
		try {
			const response = await api.createCheckoutSession();
			window.location.href = response.checkout_session_url;
		} catch ( error ) {
			console.error( 'Error creating checkout session:', error );
		}
	};

	return (
		<button onClick={ createCheckoutSession }>
			Create a Checkout Session
		</button>
	);
};

export const getCheckoutSessionElementForBacs = (
	paymentMethod,
	upeMethods,
	api
) => {
	console.log( 'getCheckoutSessionElementForBacs' );
	return (
		<CheckoutSession
			paymentMethodId={ paymentMethod }
			api={ api }
			upeMethods={ upeMethods }
		/>
	);
};
