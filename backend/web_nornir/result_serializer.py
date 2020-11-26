from nornir.core.task import AggregatedResult, MultiResult, Result


def serialize_result(aggregated_result: AggregatedResult) -> dict:
    try:
        result = {
            'failed': aggregated_result.failed,
            'hosts': []
        }

        for hostname, host_result in sorted(aggregated_result.items()):
            host_dict = {
                'hostname': host_result.host.hostname,
                'name': host_result.host.name,
                'failed': host_result.failed,
                # TODO: return exception if failed
                # 'result': aggregated_result[host_results].result[0].result if not aggregated_result[
                #     host_results].failed else f'{aggregated_result[host_results][1].exception}'
                'result': []
            }
            if isinstance(host_result, MultiResult):
                host_dict['result'].append(_apply_formatting(host_result[0]))
                for r in host_result[1:]:
                    host_dict['result'].append(_apply_formatting(r))
            elif isinstance(host_result, Result):
                host_dict['result'].append(_apply_formatting(host_result))
            result['hosts'].append(host_dict)
        return result
    except:
        return {'exception': 'Exception thrown, please check backend log'}


def _apply_formatting(result: Result):
    x = getattr(result, "result")
    if isinstance(x, dict) or isinstance(x, list) and not isinstance(x, MultiResult):
        return x
    else:
        return f'{x}'
