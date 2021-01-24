{
    "errorMessage": null,
    "results": {
        "correlation_id": "124.6113449481479",
        "transaction_status": "approved",
        "validation_status": "success",
        "transaction_type": "authorize",
        "transaction_id": "ET185722",
        "transaction_tag": "4608408432",
        "method": "credit_card",
        "amount": "13122",
        "currency": "USD",
        "cvv2": "P",
        "token": {
            "token_type": "FDToken",
            "token_data": {
                "value": "9917328858958291"
            }
        },
        "card": {
            "type": "visa",
            "cardholder_name": "Tony Allen",
            "card_number": "8291",
            "exp_date": "0721"
        },
        "bank_resp_code": "100",
        "bank_message": "Approved",
        "gateway_resp_code": "00",
        "gateway_message": "Transaction Normal",
        "retrieval_ref_no": "210122"
    }
}

210122

{
    "errorMessage": "[Error] Error charging card (L2): ",
    "results": {
        "correlation_id": "124.1134514497830",
        "Error": {
            "messages": [
                {
                    "code": "invalid_exp_date",
                    "description": "Expiry Date is invalid"
                }
            ]
        },
        "transaction_status": "Not Processed",
        "validation_status": "failed",
        "transaction_type": "authorize",
        "method": "credit_card",
        "amount": "13122",
        "currency": "USD"
    }
}

["4608408432","124.6113449481479", "124.1134514497830"]